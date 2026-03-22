import {defineChain, createWalletClient, createPublicClient, custom, webSocket, http} from 'viem';
import {privateKeyToAccount} from 'viem/accounts'
import {SDK} from '@somnia-chain/reactivity'

export const SomniaTestnet = defineChain({
    id:50312,
    name: "Somnia Testnet",
    nativeCurrency:{
      name:'Somnia Testnet Tokens',
      decimals:18,
      symbol:'STT'
    },
    rpcUrls:{
      default:
        {http:['https://dream-rpc.somnia.network'],
        webSocket:['wss://dream-rpc.somnia.network/ws']
        },
      public:{
        http:['https://dream-rpc.somnia.network'],
        webSocket:['wss://dream-rpc.somnia.network/ws']
      } 
    }
  })

export const getWalletClient = () => {
    if (typeof window === 'undefined' || !window.ethereum) throw new Error('No wallet found');
    return createWalletClient({
      chain: SomniaTestnet,
      transport: custom(window.ethereum),
    });
  };

export const wallet_Client = new Proxy({} as ReturnType<typeof getWalletClient>, {
  get: (_, prop) => getWalletClient()[prop as keyof ReturnType<typeof getWalletClient>],
});

  export const public_Client = createPublicClient({
    chain: SomniaTestnet,
    transport:webSocket()  
  })

  export const public_Client_Http = createPublicClient({
    chain: SomniaTestnet,
    transport:http('https://dream-rpc.somnia.network')  
  })


    export const somniaReactSDK = new SDK({
      public:public_Client,
    wallet:wallet_Client,
    
  })

  export const emitter_handler = "0x177B95B9C7B2A5E8182b12DF8F5e3Fef65506a7e" as `0x${string}`