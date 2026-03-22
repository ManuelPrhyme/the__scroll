import { useState, useEffect } from 'react';
import type { Article } from '../data/articles';
import { wallet_Client, emitter_handler, public_Client } from '@/components/chain_SDK_Config';
import { Abi } from '../components/contractABI';
import { parseEther, decodeEventLog } from 'viem';

const STORAGE_KEY = 'scroll_user_articles';

function loadArticles(): Article[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveArticles(articles: Article[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

type OnchainArticle = { id: bigint; author: `0x${string}`; subscriberCount: bigint };

export function useArticles({ walletAddress }: { walletAddress: string | null }) {
  const [userArticles, setUserArticles] = useState<Article[]>(loadArticles);
  const [subscribedIds, setSubscribedIds] = useState<string[]>([]);
  const [authoredIds, setAuthoredIds] = useState<string[]>([]);

  useEffect(() => {
    if (!walletAddress) {
      setSubscribedIds([]);
      setAuthoredIds([]);
      return;
    }

    const fetchAndCategorize = async () => {
      try {
        const [rawSubscribed, rawAuthored] = await Promise.all([
          public_Client.readContract({
            abi: Abi,
            address: emitter_handler,
            functionName: 'getSubscribedArticles',
            args: [walletAddress as `0x${string}`],
          }) as Promise<bigint[]>,
          public_Client.readContract({
            abi: Abi,
            address: emitter_handler,
            functionName: 'getAuthorArticles',
            args: [walletAddress as `0x${string}`],
          }) as Promise<bigint[]>,
        ]);

        const subscribedStrIds = rawSubscribed.map(String);
        const authoredStrIds = rawAuthored.map(String);

        setSubscribedIds(subscribedStrIds);
        setAuthoredIds(authoredStrIds);

        // Fetch full article data to sync author address + subscriber count
        const allIds = [...new Set([...rawSubscribed, ...rawAuthored])];
        const onchainData = await Promise.all(
          allIds.map((id) =>
            public_Client.readContract({
              abi: Abi,
              address: emitter_handler,
              functionName: 'getArticle',
              args: [id],
            }) as Promise<OnchainArticle>
          )
        );

        setUserArticles((prev) => {
          const updated = prev.map((article) => {
            const match = onchainData.find((d) => String(d.id) === article.id);
            if (!match) return article;
            return {
              ...article,
              authorAddress: match.author,
              subscriberCount: Number(match.subscriberCount),
            };
          });
          saveArticles(updated);
          return updated;
        });
      } catch (e) {
        console.error('Failed to fetch and categorize articles', e);
      }
    };

    fetchAndCategorize();
  }, [walletAddress]);

  const addArticle = async (article: Article) => {
    const price = parseEther(`${article.price}`);

    const txHash = await wallet_Client.writeContract({
      abi: Abi,
      address: emitter_handler,
      functionName: 'createArticle',
      args: [price, walletAddress as `0x${string}`],
      account: walletAddress as `0x${string}`,
    });

    const receipt = await public_Client.waitForTransactionReceipt({ hash: txHash });

    let onchainId: string | undefined;
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({ abi: Abi, data: log.data, topics: log.topics });
        if (decoded.eventName === 'ArticleCreated') {
          onchainId = String((decoded.args as { articleId: bigint }).articleId);
          break;
        }
      } catch { continue; }
    }

    // Use the onchain ID as the article's id so future fetches bind correctly
    const finalArticle: Article = {
      ...article,
      id: onchainId ?? article.id,
      authorAddress: walletAddress as `0x${string}`,
    };

    setAuthoredIds((prev) => [...prev, finalArticle.id]);
    setUserArticles((prev) => {
      const updated = [finalArticle, ...prev];
      saveArticles(updated);
      return updated;
    });
  };

  const incrementSubscriberCount = (articleId: string) => {
    setSubscribedIds((prev) => [...prev, articleId]);
    setUserArticles((prev) => {
      const updated = prev.map((a) =>
        a.id === articleId ? { ...a, subscriberCount: a.subscriberCount + 1 } : a
      );
      saveArticles(updated);
      return updated;
    });
  };

  return { userArticles, addArticle, subscribedIds, authoredIds, incrementSubscriberCount };
}
