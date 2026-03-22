import { useState } from 'react';
import { MY_PUBLISHED, type Article } from '../data/articles';
import { wallet_Client,emitter_handler,public_Client } from '@/components/chain_SDK_Config';
import {Abi} from '../components/contractABI' 
import { parseEther } from 'viem';

const STORAGE_KEY = 'scroll_user_articles';

function loadArticles(): Article[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return MY_PUBLISHED;
  }
}

export function useArticles({walletAddress}) {
  const [userArticles, setUserArticles] = useState<Article[]>(loadArticles);

  const addArticle = async (article: Article) => {

      const price = parseEther(`${article.price}`)

      const txHash = await wallet_Client.writeContract({
          abi: Abi,
          address:emitter_handler,
          functionName:"createArticle",
          args:[price,walletAddress],
          account:walletAddress,
        })
    
        const receipt = await public_Client.waitForTransactionReceipt({hash:txHash})
    
        console.log(`Transaction Complete ${receipt.logs}..${receipt.to}`)
        // toast.success(`Transaction Complete ${receipt.logs}..${receipt.to}`)
    
    setUserArticles((prev) => {
      const updated = [article, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { userArticles, addArticle };
}
