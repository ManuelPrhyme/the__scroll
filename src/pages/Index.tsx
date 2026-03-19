import { useState } from 'react';
import Navbar, { type ViewTab } from '../components/Navbar';
import ArticleCard from '../components/ArticleCard';
import ArticleEditor from '../components/ArticleEditor';
import PaymentModal from '../components/PaymentModal';
import ArticleReader from '../components/ArticleReader';
import { MOCK_ARTICLES, MY_SUBSCRIBED, MY_PUBLISHED, type Article } from '../data/articles';
import { useWallet } from "@/hooks/useWallet";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [view, setView] = useState<ViewTab>('explore');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [userArticles, setUserArticles] = useState<Article[]>(MY_PUBLISHED);

  const { walletAddress, isConnecting, connectWallet, disconnectWallet, setWalletAddress } = useWallet({setIsConnected});

  const articles = !isConnected
    ? MOCK_ARTICLES
    : view === 'explore'
    ? [...userArticles.filter((a) => !MOCK_ARTICLES.some((m) => m.id === a.id)), ...MOCK_ARTICLES]
    : view === 'subscribed'
    ? MY_SUBSCRIBED
    : userArticles;

  if (isWriting) {
    return (
      <div className="min-h-screen bg-scroll-bg text-scroll-fg font-sans antialiased">
        
        //Pass the prop to the context 
        <Navbar
          walletAddress={walletAddress}
          onDisconnectWallet={disconnectWallet}
          isConnecting={isConnecting}
          setWallet={setWalletAddress}
          isConnected={isConnected}
          onConnectWallet={connectWallet}
          view={view}
          onViewChange={setView}
          setIsConnected={setIsConnected}
        />

        <ArticleEditor
          onBack={() => setIsWriting(false)}
          onPublish={(article) => {
            setUserArticles((prev) => [article, ...prev]);
            setIsWriting(false);
            setView('my-articles');
          }}
        />
      </div>
    );
  }

  if (readingArticle) {
    return (
      <div className="min-h-screen bg-scroll-bg text-scroll-fg font-sans antialiased">
        <Navbar
          walletAddress={walletAddress}
          onDisconnectWallet={disconnectWallet}
          isConnecting={isConnecting}
          setWallet={setWalletAddress}
          isConnected={isConnected}
          onConnectWallet={connectWallet}
          view={view}
          onViewChange={setView}
          setIsConnected={setIsConnected}
        />
        <ArticleReader article={readingArticle} onBack={() => setReadingArticle(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scroll-bg text-scroll-fg font-sans antialiased">
      <Navbar
          walletAddress={walletAddress}
          onDisconnectWallet={disconnectWallet}
          isConnecting={isConnecting}
          setWallet={setWalletAddress}
          isConnected={isConnected}
          onConnectWallet={connectWallet}
          view={view}
          onViewChange={setView}
          setIsConnected={setIsConnected}
      />

      <main className="max-w-article mx-auto px-6 py-12">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-scroll-muted mb-4">
              {!isConnected ? 'Explore' : view === 'explore' ? 'All Articles' : view === 'subscribed' ? 'Paid Articles' : 'Your Articles'}
            </h2>
            {!isConnected && (
              <p className="font-serif text-scroll-muted text-lg">
                The Scroll is a place for ideas. Connect your wallet to begin.
              </p>
            )}
          </div>
          {isConnected && view === 'my-articles' && (
            <button
              onClick={() => setIsWriting(true)}
              className="bg-scroll-accent text-white px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              + Write Article
            </button>
          )}
        </header>

        <div className="space-y-12">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isPaid={view === 'subscribed' || view === 'my-articles'}
              onReadMore={(a) => {
                if (view === 'subscribed' || view === 'my-articles') {
                  setReadingArticle(a);
                } else {
                  setSelectedArticle(a);
                }
              }}
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
          walletAddress={walletAddress as `0x${string}`}
          
        />
      )}
    </div>
  );
};

export default Index;
