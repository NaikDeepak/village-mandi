import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { SYSTEM_RULES } from '@shared/constants';
import { ChevronDown, Layers, Percent, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/hero-bg.png';

export function Hero() {
  const scrollToContent = () => {
    const element = document.getElementById('our-story');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Fallback */}
      <div className="absolute inset-0 z-0 bg-mandi-green">
        <img
          src={heroBg}
          alt="Agricultural landscape"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mandi-dark/30 via-mandi-dark/60 to-mandi-dark/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white mb-6 drop-shadow-lg">
          {brand.name}
        </h1>

        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium mb-4">
          Farm-Fresh Grains, Spices & Seasonal Fruits
        </p>

        <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
          Order directly from farmers you can trust. We aggregate orders in batches for Mango, Rice,
          Jaggery, Tur Dal, Jowar, and more. Know your source. Pay fair prices.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/buyer-login">
            <Button size="lg" className="w-full sm:w-auto">
              Join as Buyer
            </Button>
          </Link>
          <Link to="/rules">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-mandi-dark"
            >
              How It Works
            </Button>
          </Link>
        </div>

        {/* Key Facts with Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-white/90">
          <div className="flex flex-col items-center gap-2">
            <Layers className="h-6 w-6 text-mandi-earth-light" aria-hidden="true" />
            <div className="text-xl font-bold">Batch Model</div>
            <div className="text-sm text-white/70">Orders aggregated in cycles</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Percent className="h-6 w-6 text-mandi-earth-light" aria-hidden="true" />
            <div className="text-xl font-bold">{SYSTEM_RULES.FACILITATION_FEE_PERCENTAGE}% Fee</div>
            <div className="text-sm text-white/70">Transparent facilitation</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Users className="h-6 w-6 text-mandi-earth-light" aria-hidden="true" />
            <div className="text-xl font-bold">Farmer-Linked</div>
            <div className="text-sm text-white/70">Full traceability</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        type="button"
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full p-2"
        aria-label="Scroll to content"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </div>
  );
}
