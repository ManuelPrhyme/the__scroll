import { useState } from 'react';
import Navbar, { type ViewTab } from '../components/Navbar';
import ArticleCard from '../components/ArticleCard';
import PaymentModal from '../components/PaymentModal';
import ArticleReader from '../components/ArticleReader';
import { MOCK_ARTICLES, MY_SUBSCRIBED, MY_PUBLISHED, type Article } from '../data/articles';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [view, setView] = useState<ViewTab>('explore');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  const articles = !isConnected
    ? MOCK_ARTICLES
    : view === 'explore'
    ? MOCK_ARTICLES
    : view === 'subscribed'
    ? MY_SUBSCRIBED
    : MY_PUBLISHED;

  if (readingArticle) {
    return (
      <div className="min-h-screen bg-scroll-bg text-scroll-fg font-sans antialiased">
        <Navbar
          isConnected={isConnected}
          onConnect={() => setIsConnected(!isConnected)}
          view={view}
          onViewChange={setView}
        />
        <ArticleReader article={readingArticle} onBack={() => setReadingArticle(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scroll-bg text-scroll-fg font-sans antialiased">
      <Navbar
        isConnected={isConnected}
        onConnect={() => setIsConnected(!isConnected)}
        view={view}
        onViewChange={setView}
      />

      <main className="max-w-article mx-auto px-6 py-12">
        <header className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-scroll-muted mb-4">
            {!isConnected ? 'Explore' : view === 'explore' ? 'All Articles' : view === 'subscribed' ? 'Paid Articles' : 'Your Articles'}
          </h2>
          {!isConnected && (
            <p className="font-serif text-scroll-muted text-lg">
              The Scroll is a place for ideas. Connect your wallet to begin.
            </p>
          )}
        </header>

        <div className="space-y-12">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onReadMore={setSelectedArticle}
            />
          ))}
        </div>
      </main>

      {selectedArticle && (
        <PaymentModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onPay={(article) => {
            setSelectedArticle(null);
            setReadingArticle(article);
          }}
        />
      )}
    </div>
  );
};

export default Index;
