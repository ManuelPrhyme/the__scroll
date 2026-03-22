import type { Article } from '../data/articles';

interface ArticleCardProps {
  article: Article;
  isPaid?: boolean;
  onReadMore: (article: Article) => void;
}

const ArticleCard = ({ article, isPaid = false, onReadMore }: ArticleCardProps) => {
  return (
    <article className="group cursor-pointer border-b border-scroll-border pb-10">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-scroll-border rounded-full flex items-center justify-center text-[10px] font-bold text-scroll-muted">
          {article.authorAvatar}
        </div>
        <span className="text-xs font-medium">{article.author}</span>
        <span className="text-scroll-muted text-xs">· {article.date}</span>
      </div>
      <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-scroll-accent transition-colors duration-200 leading-tight">
        {article.title}
      </h3>
      <p className="font-serif text-scroll-muted leading-relaxed mb-4 line-clamp-3 text-lg">
        {article.snippet}
      </p>
      <div className="flex flex-col items-start gap-2 mb-4">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => onReadMore(article)}
            className="text-scroll-accent font-medium text-sm hover:underline"
          >
            {isPaid ? 'Continue reading' : `Read more (${article.price} SOmnia)`}
          </button>
          <div className="flex gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-scroll-surface px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-scroll-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {article.subscriberCount > 0 && (
          <span className="text-sm font-bold text-scroll-muted">
            {article.subscriberCount} subscribers
          </span>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;
