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
}

const tabs: { key: ViewTab; label: string }[] = [
  { key: 'explore', label: 'Explore' },
  { key: 'subscribed', label: 'Subscribed' },
  { key: 'my-articles', label: 'My Articles' },
];

const Navbar = ({ view, onViewChange, walletAddress, onConnectWallet, onDisconnectWallet, isConnecting, setWallet, isConnected }: NavbarProps) => {
  
  useEffect(() => {
    const checkWallet = async () => {
          const wallet = await window.ethereum.request({ method: "eth_accounts" })

        setWallet(wallet[0] || null)

        window.ethereum.on('accountsChanged',(accounts)=>{
          setWallet(accounts[0] || null)
        })

        // return window.ethereum.removeListener("accountsChanged",(accounts)=>{
        //   setWalletHere(accounts[0] || null)
        // })
    }
    
    checkWallet()
  
  }, [walletAddress])
  
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

// import { useState, useEffect } from "react";
// import { PenLine } from "lucide-react";
// import Full from "../assets/The Scroll.png"

// interface NavbarProps {
//   activeTab: "subscribed" | "publications" | "explore";
//   onTabChange: (tab: "subscribed" | "publications" | "explore") => void;
//   walletAddress: string | null;
//   onConnectWallet: () => void;
//   onDisconnectWallet: () => void;
//   isConnecting: boolean;
//   setWallet: (address: string | null) => void;
// }

// const Navbar = ({ activeTab, onTabChange, walletAddress, onConnectWallet, onDisconnectWallet, isConnecting, setWallet }: NavbarProps) => {
   

//   useEffect(() => {
//     const checkWallet = async () => {
//           const wallet = await window.ethereum.request({ method: "eth_accounts" })

//         setWallet(wallet[0] || null)

//         window.ethereum.on('accountsChanged',(accounts)=>{
//           setWallet(accounts[0] || null)
//         })

//         // return window.ethereum.removeListener("accountsChanged",(accounts)=>{
//         //   setWalletHere(accounts[0] || null)
//         // })
//     }
    
//     checkWallet()
  
//   }, [walletAddress])

//   return (
//     <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-brand-border">
//       <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
//         <div className="flex items-center gap-8">
        
//           <img src={Full} alt="" className="w-60 h-auto"/>
//           <div className="hidden md:flex gap-1 font-sans text-sm">
//             <button
//               onClick={() => onTabChange("subscribed")}
//               className={`px-3 py-1.5 rounded-full transition-colors ${
//                 activeTab === "subscribed"
//                   ? "text-foreground font-medium"
//                   : "text-brand-gray hover:text-foreground"
//               }`}
//             >
//               Subscribed
//             </button>
//             <button
//               onClick={() => onTabChange("publications")}
//               className={`px-3 py-1.5 rounded-full transition-colors ${
//                 activeTab === "publications"
//                   ? "text-foreground font-medium"
//                   : "text-brand-gray hover:text-foreground"
//               }`}
//             >
//               My Publications
//             </button>
//             <button
//               onClick={() => onTabChange("explore")}
//               className={`px-3 py-1.5 rounded-full transition-colors ${
//                 activeTab === "explore"
//                   ? "text-foreground font-medium"
//                   : "text-brand-gray hover:text-foreground"
//               }`}
//             >
//               Explore
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center gap-4 font-sans">
//           <button className="hidden sm:flex items-center gap-1.5 text-sm text-brand-gray hover:text-foreground transition-colors">
//             <PenLine className="w-4 h-4" />
//             Write
//           </button>
//           {walletAddress ? (
//             <button
//               onClick={onDisconnectWallet}
//               className="flex items-center gap-2 px-4 py-2 bg-brand-light rounded-full text-sm font-medium hover:opacity-80 transition-all"
//             >
//               <span className="w-2 h-2 rounded-full bg-brand-green" />
//               <span className="font-mono text-foreground">
//                 {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
//               </span>
//             </button>
//           ) : (
//             <button
//               onClick={onConnectWallet}
//               disabled={isConnecting}
//               className="px-4 py-2 bg-foreground text-background text-sm rounded-full font-medium hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
//             >
//               {isConnecting ? "Connecting…" : "Connect Wallet"}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Mobile tabs */}
//       <div className="flex md:hidden border-t border-brand-border font-sans">
//         <button
//           onClick={() => onTabChange("subscribed")}
//           className={`flex-1 py-3 text-sm text-center transition-colors ${
//             activeTab === "subscribed"
//               ? "text-foreground font-medium border-b-2 border-foreground"
//               : "text-brand-gray"
//           }`}
//         >
//           Subscribed
//         </button>
//         <button
//           onClick={() => onTabChange("publications")}
//           className={`flex-1 py-3 text-sm text-center transition-colors ${
//             activeTab === "publications"
//               ? "text-foreground font-medium border-b-2 border-foreground"
//               : "text-brand-gray"
//           }`}
//         >
//           My Publications
//         </button>
//         <button
//           onClick={() => onTabChange("explore")}
//           className={`flex-1 py-3 text-sm text-center transition-colors ${
//             activeTab === "explore"
//               ? "text-foreground font-medium border-b-2 border-foreground"
//               : "text-brand-gray"
//           }`}
//         >
//           Explore
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

