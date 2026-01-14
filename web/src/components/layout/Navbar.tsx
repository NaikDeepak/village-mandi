```
import { Menu, X, ShoppingBasket } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w - full z - 50 transition - all duration - 300 ${ scrolled ? 'bg-eco-teal shadow-md py-2' : 'bg-transparent py-4' } `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg border border-white/30">
              <ShoppingBasket className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Virtual<span className="text-eco-yellow">Mandi</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <a href="#" className="font-medium text-white hover:text-eco-yellow transition-colors">Home</a>
            <a href="#how-it-works" className="font-medium text-white hover:text-eco-yellow transition-colors">How it Works</a>
            <a href="#philosophy" className="font-medium text-white hover:text-eco-yellow transition-colors">Philosophy</a>
            <a href="#" className="font-medium text-white hover:text-eco-yellow transition-colors">Packages</a>
            <a href="#" className="font-medium text-white hover:text-eco-yellow transition-colors">About Us</a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
             <Link 
              to="/login" 
              className="px-6 py-2.5 rounded-full bg-eco-yellow text-eco-dark font-bold hover:bg-yellow-400 transition-all hover:shadow-lg active:scale-95 text-sm"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-eco-yellow p-2 rounded-md focus:outline-none"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-eco-teal border-t border-white/10 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a href="#" className="block px-3 py-3 text-base font-medium text-white hover:text-eco-yellow">Home</a>
            <a href="#how-it-works" className="block px-3 py-3 text-base font-medium text-white hover:text-eco-yellow">How it Works</a>
            <a href="#philosophy" className="block px-3 py-3 text-base font-medium text-white hover:text-eco-yellow">Philosophy</a>
            <Link 
              to="/login"
              className="block w-full text-center mt-4 px-5 py-3 rounded-lg bg-eco-yellow text-eco-dark font-bold shadow-md active:bg-yellow-400"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
```
