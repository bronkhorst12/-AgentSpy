import { Buffer } from 'buffer';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { WalletContextProvider } from './contexts/WalletContextProvider.tsx'
import './index.css'
import App from './App.tsx'

// Polyfill Buffer for browser
window.Buffer = Buffer;
globalThis.Buffer = Buffer;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </ErrorBoundary>
  </StrictMode>,
)
