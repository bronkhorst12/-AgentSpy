import { FC, useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
  showText?: boolean;
}

export const CopyButton: FC<CopyButtonProps> = ({ text, className = '', showText = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center space-x-2 px-2 py-1 hover:bg-zinc-800 rounded transition-colors ${className}`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-white" />
          {showText && <span className="text-xs text-white">Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
          {showText && <span className="text-xs text-zinc-500 group-hover:text-zinc-300">Copy</span>}
        </>
      )}
    </button>
  );
};
