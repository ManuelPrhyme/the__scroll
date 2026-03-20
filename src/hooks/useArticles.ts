import { useState } from 'react';
import { MY_PUBLISHED, type Article } from '../data/articles';

const STORAGE_KEY = 'scroll_user_articles';

function loadArticles(): Article[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : MY_PUBLISHED;
  } catch {
    return MY_PUBLISHED;
  }
}

export function useArticles() {
  const [userArticles, setUserArticles] = useState<Article[]>(loadArticles);

  const addArticle = (article: Article) => {
    setUserArticles((prev) => {
      const updated = [article, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { userArticles, addArticle };
}
