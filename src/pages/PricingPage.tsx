import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import GhostLogo from '@/components/GhostLogo';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GhostLogo size={32} />
            <span className="font-bold text-white tracking-tight">
              Ghost<span className="text-[#00ff41]">Meta</span>
            </span>
          </Link>
          <Link 
            to="/" 
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Back to App
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Pricing />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
