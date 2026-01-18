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
          className="w-full h-full object-cover opacity-90"
        />
        {/* Cinematic Scrim - Gradient from bottom-left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 animate-fade-in-up">
        {/* Brand Label */}
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
          <span className="text-xs font-medium text-white tracking-widest uppercase">
            Direct from the Source
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-white mb-6 drop-shadow-sm text-balance">
          {brand.name}
        </h1>

        <p className="text-xl md:text-3xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light mb-8 text-balance">
          Reconnect with the hands that feed you.
        </p>

        <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
          Join a community of mindful eaters who support farmers directly.
          Experience the taste of trust, transparency, and tradition in every batch.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/buyer-login">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-mandi-green/20">
              Join the Community
            </Button>
          </Link>
          <Link to="/buyer-dashboard">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base border-white text-white hover:bg-white hover:text-mandi-dark backdrop-blur-sm bg-white/5"
            >
              See Batches & Prices
            </Button>
          </Link>
        </div>

        {/* Commitment Highlight */}
        <p className="text-white/80 text-sm font-medium mb-12 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-mandi-earth-light" />
          Secure your batch with just <span className="text-white font-bold border-b border-mandi-earth-light/50">10% commitment fee</span>
        </p>

        {/* WhatsApp Contact - Subtle & Accessible */}
        <div className="flex justify-center">
          <a
            href="https://wa.me/919689823838"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with us on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator - Minimal */}
      <button
        type="button"
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 hover:text-white transition-colors duration-300 focus:outline-none animate-bounce-slow"
        aria-label="Scroll to content"
      >
        <ChevronDown className="h-6 w-6" />
      </button>
    </div>
  );
}
