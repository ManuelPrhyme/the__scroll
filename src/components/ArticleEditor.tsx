import { useState } from 'react';
import type { Article } from '../data/articles';

interface ArticleEditorProps {
  onBack: () => void;
  onPublish: (article: Article) => void;
}

const AVAILABLE_TAGS = ['Web3', 'Culture', 'Tokenomics', 'DeFi', 'Opinion', 'Writing', 'Productivity', 'Engineering', 'Smart Contracts'];

const ArticleEditor = ({ onBack, onPublish }: ArticleEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 3 ? [...prev, tag] : prev
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const priceNum = Number(price);

    if (!trimmedTitle) newErrors.title = 'Title is required';
    else if (trimmedTitle.length > 200) newErrors.title = 'Title must be under 200 characters';

    if (!trimmedContent) newErrors.content = 'Content is required';
    else if (trimmedContent.length < 50) newErrors.content = 'Content must be at least 50 characters';
    else if (trimmedContent.length > 50000) newErrors.content = 'Content must be under 50,000 characters';

    if (!price) newErrors.price = 'Price is required';
    else if (isNaN(priceNum) || priceNum < 0 || priceNum > 1000) newErrors.price = 'Price must be 0–1000';

    if (selectedTags.length === 0) newErrors.tags = 'Select at least one tag';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = () => {
    if (!validate()) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const snippet = trimmedContent.length > 200 ? trimmedContent.slice(0, 200) + '…' : trimmedContent;

    const article: Article = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      snippet,
      author: 'You',
      authorAvatar: 'YO',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tags: selectedTags,
      price: Number(price),
      fullContent: trimmedContent,
    };

    onPublish(article);
  };

  return (
    <div className="max-w-article mx-auto px-6 py-12">
      <button
        onClick={onBack}
        className="text-sm text-scroll-muted hover:text-scroll-fg transition-colors duration-200 mb-8 inline-block"
      >
        ← Back to my articles
      </button>

      <h1 className="font-serif text-3xl font-bold mb-10 tracking-tight">Write a new article</h1>

      {/* Title */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-widest text-scroll-muted mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder="Your article title"
          className="w-full bg-scroll-surface border border-scroll-border px-4 py-3 font-serif text-xl focus:outline-none focus:border-scroll-accent transition-colors"
        />
        {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Content */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-widest text-scroll-muted mb-2">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={50000}
          rows={16}
          placeholder="Write your article here. Use blank lines to separate paragraphs."
          className="w-full bg-scroll-surface border border-scroll-border px-4 py-3 font-serif text-lg leading-relaxed focus:outline-none focus:border-scroll-accent transition-colors resize-y"
        />
        <div className="flex justify-between mt-1">
          {errors.content ? (
            <p className="text-red-600 text-xs">{errors.content}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-scroll-muted">{content.length.toLocaleString()} / 50,000</span>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-widest text-scroll-muted mb-2">
          Tags <span className="normal-case font-normal">(up to 3)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 text-xs uppercase font-bold tracking-wider transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-scroll-fg text-white'
                  : 'bg-scroll-surface text-scroll-muted hover:text-scroll-fg'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {errors.tags && <p className="text-red-600 text-xs mt-1">{errors.tags}</p>}
      </div>

      {/* Price */}
      <div className="mb-10">
        <label className="block text-xs font-bold uppercase tracking-widest text-scroll-muted mb-2">
          Price (SOmnia)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min={0}
          max={1000}
          placeholder="0"
          className="w-32 bg-scroll-surface border border-scroll-border px-4 py-3 text-lg focus:outline-none focus:border-scroll-accent transition-colors"
        />
        {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
      </div>

      {/* Publish */}
      <button
        onClick={handlePublish}
        className="bg-scroll-accent text-white px-8 py-3 font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Publish Article
      </button>
    </div>
  );
};

export default ArticleEditor;
