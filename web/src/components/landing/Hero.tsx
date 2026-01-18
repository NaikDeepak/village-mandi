import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/hero-bg.png';

export function Hero() {
  const scrollToContent = () => {
    const element = document.getElementById('our-story');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Static & Cinematic */}
      <div className="absolute inset-0 z-0 bg-mandi-green-dark">
        <img
          src={heroBg}
          alt="Lush green farm landscape"
          className="w-full h-full object-cover opacity-80"
        />
        {/* Cinematic Scrim - Darker, flatter overlay for maximal text contrast */}
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 text-center pt-20 animate-fade-in-up">
        {/* Editorial Brand Label */}
        <div className="mb-8 flex justify-center">
          <span className="px-4 py-1.5 rounded-full border border-white/30 bg-white/5 backdrop-blur-md text-[11px] font-bold tracking-[0.2em] text-white uppercase transform hover:scale-105 transition-transform duration-300 cursor-default">
            Direct Source • Est. 2024
          </span>
        </div>

        {/* Headline - "The Promise" */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium tracking-tight text-white mb-8 leading-[0.9] drop-shadow-lg text-balance opacity-95">
          {brand.name}
        </h1>

        {/* Subhead - "The Truth" */}
        <p className="text-xl md:text-3xl text-white/90 max-w-2xl mx-auto leading-snug font-light mb-12 text-balance tracking-wide">
          Reconnect with the hands that feed you.
          <span className="block mt-2 text-white/70 text-lg md:text-xl">
            Experience the trust of a village, delivered.
          </span>
        </p>

        {/* Primary Actions - Clean & Minimal */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-14">
          <Link to="/buyer-login">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-2xl hover:bg-mandi-green-light transition-all duration-300">
              Join the Community
            </Button>
          </Link>
          <Link to="/buyer-dashboard">
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-10 text-lg rounded-full border border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm bg-transparent transition-all duration-300"
            >
              View Batches
            </Button>
          </Link>
        </div>

        {/* Commitment Highlight - The "Hook" */}
        <div className="inline-flex flex-col items-center gap-3">
          <div className="h-8 w-[1px] bg-white/30 mb-2"></div>
          <p className="text-white/80 text-sm font-medium tracking-wide">
            RESERVE WITH <span className="text-white font-bold border-b border-white/40 pb-0.5 mx-1">10% COMMITMENT</span>
          </p>
        </div>
      </div>

      {/* Floating WhatsApp - Bottom Right fixed */}
      <a
        href="https://wa.me/919689823838"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 right-8 z-20 flex items-center gap-3 text-white/80 hover:text-white transition-opacity duration-300 group"
      >
        <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">Chat with us</span>
        <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-green-500 hover:border-green-500 transition-all duration-300">
          <MessageCircle className="w-5 h-5" />
        </div>
      </a>

      {/* Scroll Indicator - Minimal */}
      <button
        type="button"
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/40 hover:text-white transition-colors duration-300 focus:outline-none animate-pulse"
        aria-label="Scroll to content"
      >
        <ChevronDown className="h-8 w-8 stroke-[1px]" />
      </button>
    </div>
  );
}
