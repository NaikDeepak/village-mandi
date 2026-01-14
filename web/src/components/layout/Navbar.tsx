import { Menu, X, Wheat } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  variant?: 'home' | 'internal';
}

export function Navbar({ variant = 'home' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isScrolled = variant === 'internal' || scrolled;

  return (
    <nav className={`fixed w-full z-50 ${isScrolled ? 'bg-mandi-green shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg border border-white/30">
              <Wheat className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Virtual<span className="text-mandi-earth-light">Mandi</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium text-white hover:text-mandi-earth-light">Home</Link>
            <Link to="/rules" className="font-medium text-white hover:text-mandi-earth-light">Rules</Link>
            <a href="/#how-it-works" className="font-medium text-white hover:text-mandi-earth-light">How it Works</a>
            <a href="/#philosophy" className="font-medium text-white hover:text-mandi-earth-light">Philosophy</a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link to="/login">
              <Button className="bg-white text-mandi-green hover:bg-mandi-cream">
                Join as Buyer
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-mandi-earth-light p-2 rounded-md focus:outline-none"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-mandi-green border-t border-white/10 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" className="block px-3 py-3 text-base font-medium text-white hover:text-mandi-earth-light" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/rules" className="block px-3 py-3 text-base font-medium text-white hover:text-mandi-earth-light" onClick={() => setIsOpen(false)}>Rules</Link>
            <a href="/#how-it-works" className="block px-3 py-3 text-base font-medium text-white hover:text-mandi-earth-light" onClick={() => setIsOpen(false)}>How it Works</a>
            <a href="/#philosophy" className="block px-3 py-3 text-base font-medium text-white hover:text-mandi-earth-light" onClick={() => setIsOpen(false)}>Philosophy</a>
            <Link
              to="/login"
              className="block w-full text-center mt-4 px-5 py-3 rounded-lg bg-white text-mandi-green font-bold shadow-md"
              onClick={() => setIsOpen(false)}
            >
              Join as Buyer
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
