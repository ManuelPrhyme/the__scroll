import { useState, useEffect } from 'react';
import type { Article } from '../data/articles';
import {wallet_Client, public_Client, somniaReactSDK, emitter_handler} from './chain_SDK_Config'
import { 
  parseEther,
  keccak256,toHex,
  zeroHash,parseGwei,
  encodeFunctionData,
} from 'viem';

import {Abi} from './contractABI.tsx';

import {
  type WebsocketSubscriptionInitParams, 
  type SubscriptionCallback,
  type SoliditySubscriptionData,
} from '@somnia-chain/reactivity'


interface PaymentModalProps {
  article: Article;
  onClose: () => void;
  onPay: (article: Article) => void;
  walletAddress:`0x${string}`;
  ABI:string[];

}

  const event_PurchaseComplete_Topic0 = keccak256(toHex("ArticlePurchased(uint256,address,uint256)"))
  const even_PublishComplete_Topic0 = keccak256(toHex("ArticleCreated(uint256,address,uint256)"))

  const solidity_Subscription: SoliditySubscriptionData = {
    emitter:emitter_handler,
    eventTopics:[event_PurchaseComplete_Topic0,zeroHash,zeroHash,zeroHash],
    handlerContractAddress:emitter_handler,
    priorityFeePerGas:parseGwei('5'),
    maxFeePerGas:parseGwei('15'),
    gasLimit:3_000_000n,
    isGuaranteed:true,
    isCoalesced:false
  }

const PaymentModal = ({ article, onClose, onPay, walletAddress, ABI }: PaymentModalProps) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paid, setPaid] = useState(false);

   useEffect(()=>{

    const initParams: WebsocketSubscriptionInitParams = {
    ethCalls:[{
      to:emitter_handler,
      data:encodeFunctionData({
        abi:ABI,
        functionName:"getArticle",
        args:[article.id]
      })
    },
    // {
    //   to:emitter_handler,
    //   data:encodeFunctionData({
    //     abi:ABI, // ABI Unknown
    //     functionName:"getArticlePrice",
    //     args:[article.id]
    //   })
    // }
  ],
    eventContractSources:[emitter_handler],
    topicOverrides:[event_PurchaseComplete_Topic0],
    onData:(subCallback: SubscriptionCallback)=>{

    }
  }

  const subscriber =  async () => {
      const subscription = await somniaReactSDK.subscribe(initParams)
      console.log("The subscription: ", subscription)
  }

  subscriber()

  console.log("This is the article ID:", article.id);

   },[])
  //I need to add the id of the article to the unlockedIds from the state onchain
  const handlePay = async () => {
    if (!article) return;
    setIsPaying(true);

    const txHash = await wallet_Client.writeContract({
      abi: Abi,
      address:emitter_handler,
      functionName:"purchaseArticle",
      args:[article.id],
      account:walletAddress,
      value:parseEther(`${article.price}`)
    })

    const receipt = await public_Client.waitForTransactionReceipt({hash:txHash})

    console.log(`Transaction Complete ${receipt.logs}..${receipt.to}`)
    // toast.success(`Transaction Complete ${receipt.logs}..${receipt.to}`)

      setIsPaying(false);
      setPaid(true);

  };


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
              <p className="text-md text-scroll-muted mt-1">Somnia Tokens</p>
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
