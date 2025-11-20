import { Link, useLocation } from 'react-router-dom';
import { Activity, TrendingUp, Shield, Zap } from 'lucide-react';
import { WalletButton } from '../WalletButton';
import Squares from '../Squares';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/whale-activity', label: 'Whale Activity', icon: Activity },
    { path: '/market-flow', label: 'Market Flow', icon: TrendingUp },
    { path: '/staking-monitor', label: 'Staking Monitor', icon: Shield },
    { path: '/real-time-feed', label: 'Real Time Feed', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-purple-500/30 relative flex flex-col">
      <div className="fixed inset-0 z-0">
        <Squares
          direction="left"
          speed={0.3}
          squareSize={32}
          borderColor="#8B809D"
          hoverFillColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Unified Modern Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl transition-all duration-300">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">

            {/* Left: Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-purple-500/20 group-hover:border-purple-500/30 transition-all duration-500">
                <img src="/logo.jpg" alt="AgentSpy" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 group-hover:to-white transition-all duration-300 tracking-tight">
                AgentSpy
              </h1>
            </Link>

            {/* Center: Navigation Pills */}
            <nav className="hidden md:flex items-center bg-zinc-900/40 rounded-full p-1.5 border border-white/5 backdrop-blur-md shadow-xl shadow-black/20">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-out ${isActive
                        ? 'bg-zinc-800 text-white shadow-lg shadow-black/40 ring-1 ring-white/10'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-purple-400' : 'group-hover:text-zinc-200'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Status & Wallet */}
            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-xs font-medium text-emerald-500/80 tracking-wide uppercase">System Live</span>
              </div>

              <div className="pl-6 border-l border-white/5">
                <WalletButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 pt-28 pb-12 flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-900 bg-black py-10 mt-auto">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-zinc-600">
              <p>
                AgentSpy &copy; {new Date().getFullYear()} — Solana Intelligence
              </p>
              <p className="mt-2 md:mt-0">
                Real-time blockchain analytics
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
