import type { Article } from '../data/articles';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
}

const ArticleReader = ({ article, onBack }: ArticleReaderProps) => {
  return (
    <div className="max-w-article mx-auto px-6 py-12">
      <button
        onClick={onBack}
        className="text-sm text-scroll-muted hover:text-scroll-fg transition-colors duration-200 mb-8 inline-block"
      >
        ← Back to feed
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-scroll-border rounded-full flex items-center justify-center text-xs font-bold text-scroll-muted">
          {article.authorAvatar}
        </div>
        <div>
          <span className="text-sm font-medium block">{article.author}</span>
          <span className="text-scroll-muted text-xs">{article.date}</span>
        </div>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-8 leading-tight tracking-tight">
        {article.title}
      </h1>

      <div className="font-serif text-lg leading-relaxed text-scroll-fg space-y-6">
        {article.fullContent.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="flex gap-2 mt-12 pt-8 border-t border-scroll-border">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="bg-scroll-surface px-3 py-1.5 text-xs uppercase font-bold tracking-wider text-scroll-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ArticleReader;
