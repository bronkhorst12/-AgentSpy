import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Wallet, ChevronDown, Copy, LogOut, ExternalLink, Check } from 'lucide-react';

export const WalletButton: FC = () => {
  const { publicKey, disconnect, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch balance when connected
  useState(() => {
    if (publicKey && connected) {
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / LAMPORTS_PER_SOL);
      });
    } else {
      setBalance(null);
    }
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (publicKey) {
      window.open(`https://solscan.io/account/${publicKey.toString()}`, '_blank');
    }
  };

  if (!connected || !publicKey) {
    return (
      <div className="wallet-button-wrapper">
        <WalletMultiButton className="!bg-white !text-black !font-bold !rounded-lg !px-4 !py-2 hover:!bg-zinc-200 !transition-colors" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 hover:bg-zinc-800 transition-all"
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <Wallet className="w-4 h-4 text-black" />
        </div>
        <div className="text-left">
          <p className="text-xs text-zinc-500">Wallet Connected</p>
          <p className="text-sm font-mono text-white">{formatAddress(publicKey.toString())}</p>
        </div>
        {balance !== null && (
          <div className="text-right">
            <p className="text-xs text-zinc-500">Balance</p>
            <p className="text-sm font-semibold text-white">{balance.toFixed(4)} SOL</p>
          </div>
        )}
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl z-50">
            <div className="p-4 border-b border-zinc-800">
              <p className="text-xs text-zinc-500 mb-1">Wallet Address</p>
              <p className="text-sm font-mono text-white break-all">{publicKey.toString()}</p>
              {balance !== null && (
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Balance</span>
                    <span className="text-lg font-bold text-white">{balance.toFixed(4)} SOL</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-zinc-900 rounded-lg transition-colors text-left"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Copy className="w-4 h-4 text-zinc-400" />
                )}
                <span className="text-sm text-zinc-300">{copied ? 'Copied!' : 'Copy Address'}</span>
              </button>
              <button
                onClick={openExplorer}
                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-zinc-900 rounded-lg transition-colors text-left"
              >
                <ExternalLink className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">View on Solscan</span>
              </button>
              <div className="border-t border-zinc-800 my-2" />
              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-zinc-900 rounded-lg transition-colors text-left group"
              >
                <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                <span className="text-sm text-zinc-400 group-hover:text-white">Disconnect</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
