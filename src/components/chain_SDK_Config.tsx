import {defineChain, createWalletClient, createPublicClient, custom, webSocket, http} from 'viem';
import {privateKeyToAccount} from 'viem/accounts'
import {SDK} from '@somnia-chain/reactivity'

export const SomniaTestnet = defineChain({
    id:50312,
    name: "Somnia Testnet",
    nativeCurrency:{
      name:'STT',
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

  export const Anvil = defineChain({
      id:31337,
      name: "Anvil",
      nativeCurrency:{
        name:'ETH',
        decimals:18,
        symbol:'ETH'
      },
      rpcUrls:{
        default:
          {http:['http://127.0.0.1:8545'],
            webSocket:['ws://127.0.0.1:8545/ws']
          } 
      }
  
    })

    const account = privateKeyToAccount(import.meta.env.VITE_PRIVATE_KEY)

    export const wallet_Client = createWalletClient({
    account,
    chain:SomniaTestnet,
    transport: custom(window.ethereum)
  })

  export const public_Client = createPublicClient({
    chain: SomniaTestnet,
    transport:webSocket()  
  })

  export const public_Client_Http = createPublicClient({
    chain: SomniaTestnet,
    transport:http('https://dream-rpc.somnia.network')  
  })


    export const somniaReactSDK = new SDK({
    wallet:wallet_Client,
    public:public_Client
  })

  export const emitter_handler = "0x177B95B9C7B2A5E8182b12DF8F5e3Fef65506a7e" as `0x${string}`