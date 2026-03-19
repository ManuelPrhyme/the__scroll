import { useState, useCallback } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}


export const useWallet = ({setIsConnected}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("No wallet found", {
        description: "Please install MetaMask or another Web3 wallet.",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true)
        toast.success("Wallet connected", {
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });

        console.log("Seeit",accounts[0])
      }
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (err.code === 4001) {
        toast.error("Connection rejected", {
          description: "You rejected the wallet connection request.",
        });
      } else {
        toast.error("Connection failed", {
          description: err.message || "Could not connect wallet.",
        });
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    await window.ethereum.request({ method: "wallet_revokePermissions",params:[{eth_accounts:{}}] })
    setWalletAddress(null);
    setIsConnected(false)
    toast.info("Wallet disconnected");
  }, []);

  return { walletAddress, isConnecting, connectWallet, disconnectWallet, setWalletAddress };
};
