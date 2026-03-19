export type ViewTab = 'explore' | 'subscribed' | 'my-articles';

interface NavbarProps {
  isConnected: boolean;
  onConnect: () => void;
  view: ViewTab;
  onViewChange: (view: ViewTab) => void;
}

const tabs: { key: ViewTab; label: string }[] = [
  { key: 'explore', label: 'Explore' },
  { key: 'subscribed', label: 'Subscribed' },
  { key: 'my-articles', label: 'My Articles' },
];

const Navbar = ({ isConnected, onConnect, view, onViewChange }: NavbarProps) => {
  return (
    <nav className="border-b border-scroll-border sticky top-0 bg-scroll-bg z-10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold tracking-tight">The Scroll</h1>
        <div className="flex items-center gap-8">
          {isConnected && (
            <div className="flex gap-6 text-sm font-medium">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => onViewChange(tab.key)}
                  className={`transition-colors duration-200 ${
                    view === tab.key ? 'text-scroll-fg' : 'text-scroll-muted hover:text-scroll-fg'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={onConnect}
            className="bg-scroll-fg text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-black transition-colors duration-200"
          >
            {isConnected ? '0x71C...8A2' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
