import { useState } from 'react';
import type { Article } from '../data/articles';

interface PaymentModalProps {
  article: Article;
  onClose: () => void;
  onPay: (article: Article) => void;
}

// const Anvil = defineChain({
//     id:31338,
//     name: "Anvil",
//     nativeCurrency:{
//       name:'ether',
//       decimals:'18',
//       symbol:'ETH'
//     },
//     rpcUrls:{
//       default:
//         {http:['http://127.0.0.1:8545']
//         } 
//     }

//   })

//   const walletClient = createWalletClient({
//     chain:Anvil,
//     transport:http(),
//     account: walletAddress as `0x${string}`
//   })

const PaymentModal = ({ article, onClose, onPay }: PaymentModalProps) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaid(true);
    }, 1500);
  };

  // const handlePay = async () => {
  //   if (!selectedArticle) return;
  //   setUnlockedIds((prev) => new Set(prev).add(selectedArticle.id));
  //   setShowPayment(false);

  //   const txHash = await walletClient.writeContract({
  //     abi: Abi,
  //     address:"0x4EEba27a210EcEb864F40e20C2262F3eD4d9694c",
  //     functionName:"purchaseArticle",
  //     args:[1],
  //     account:walletAddress,
  //     value:parseEther(selectedArticle.price.toFixed(3))
  //   })

  //   const receipt = await walletClient.waitForTransactionReceipt({hash:txHash})

  //     toast.success(`Transaction Complete ${receipt.logs}..${receipt.to}`)
    

  //   toast.success("Article unlocked", {
  //     description: `You paid ${selectedArticle.price.toFixed(1)} SOMNIA to ${selectedArticle.author}`,
  //   });

  //   setShowArticle(true);
    
  // };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-scroll-bg border border-scroll-fg max-w-md w-full mx-4 p-8">
        {!paid ? (
          <>
            <p className="text-xs font-sans font-bold uppercase tracking-widest text-scroll-muted mb-6">
              Unlock Article
            </p>
            <h2 className="font-serif text-xl font-bold mb-2 leading-tight">{article.title}</h2>
            <p className="text-sm text-scroll-muted mb-8">by {article.author}</p>

            <div className="border-t border-b border-scroll-border py-6 mb-8 text-center">
              <p className="text-4xl font-serif font-bold">{article.price}</p>
              <p className="text-md text-scroll-muted mt-1">STT</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-scroll-border px-4 py-2.5 text-sm font-medium text-scroll-muted hover:bg-scroll-surface transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                disabled={isPaying}
                className="flex-1 bg-scroll-accent text-white px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
              >
                {isPaying ? 'Confirming...' : 'Pay & Read'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-scroll-accent text-4xl mb-4">✓</p>
            <h2 className="font-serif text-xl font-bold mb-2">Payment Confirmed</h2>
            <p className="text-sm text-scroll-muted mb-6">You now have access to this article.</p>
            <button
              onClick={() => onPay(article)}
              className="bg-scroll-fg text-white px-6 py-2.5 text-sm font-medium hover:bg-black transition-colors duration-200"
            >
              Read Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
