import Full from "../assets/The Scroll.png"
import { useEffect } from "react";

export type ViewTab = 'explore' | 'subscribed' | 'my-articles';

interface NavbarProps {
  view: ViewTab;
  onViewChange: (view: ViewTab) => void;
  walletAddress: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  isConnecting: boolean;
  setWallet: (address: string | null) => void;
  isConnected: boolean
  setIsConnected(status:boolean): void;
}

const tabs: { key: ViewTab; label: string }[] = [
  { key: 'explore', label: 'Explore' },
  { key: 'subscribed', label: 'Subscribed' },
  { key: 'my-articles', label: 'My Articles' },
];

const Navbar = ({ view, onViewChange, walletAddress, onConnectWallet, onDisconnectWallet, isConnecting, setWallet, isConnected, setIsConnected }: NavbarProps) => {
  
  useEffect(() => {
    const checkWallet = async () => {
          const wallet = await window.ethereum.request({ method: "eth_accounts" })

        setWallet(wallet[0] || null)
        
        if(wallet[0]) {setIsConnected(true)}

        window.ethereum.on('accountsChanged',(accounts)=>{
          setWallet(accounts[0] || null)
          
        })

        // return window.ethereum.removeListener("accountsChanged",(accounts)=>{
        //   setWalletHere(accounts[0] || null)
        // })
    }
    
    checkWallet()
  
  }, [])
  
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
          
          { walletAddress ? (
            <button
            onClick={onDisconnectWallet}
            className="bg-scroll-fg text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-black transition-colors duration-200"
          >
            <span className="w-2 h-2 rounded-full bg-brand-green" />
              <span className="font-mono text-foreground">
                {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
              </span>
          </button>) :(
            <button
              onClick={onConnectWallet}
              disabled={isConnecting}
              className="bg-scroll-fg text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-black transition-colors duration-200 disabled:opacity-50"
            >
              {isConnecting ? "Connecting…" : "Connect Wallet"}
            </button>
          )}

          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


