import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { Menu, Wheat, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  variant?: 'home' | 'internal';
}

export function Navbar({ variant = 'home' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally re-run when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isScrolled = variant === 'internal' || scrolled;
  const isActive = (path: string) => location.pathname === path;

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname !== '/') {
      // If not on home page, navigate then scroll
      window.location.href = `/#${id}`;
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'BUYER') return '/buyer-dashboard';
    return '/';
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-mandi-green/90 backdrop-blur-md shadow-lg py-3 border-b border-white/10'
          : 'bg-black/15 backdrop-blur-[4px] py-5 border-b border-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-mandi-green rounded-lg"
          >
            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg border border-white/30">
              <Wheat className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Apna<span className="text-mandi-earth-light">Khet</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1 ${isActive('/') ? 'text-mandi-earth-light' : 'text-white hover:text-mandi-earth-light'}`}
            >
              Home
            </Link>
            {/* biome-ignore lint/a11y/useValidAnchor: Same-page navigation to anchor section */}
            <a
              href="#our-story"
              onClick={(e) => handleAnchorClick(e, 'our-story')}
              className="font-medium text-white hover:text-mandi-earth-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
            >
              Our Story
            </a>
            {/* biome-ignore lint/a11y/useValidAnchor: Same-page navigation to anchor section */}
            <a
              href="#how-it-works"
              onClick={(e) => handleAnchorClick(e, 'how-it-works')}
              className="font-medium text-white hover:text-mandi-earth-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
            >
              How it Works
            </a>
            <Link
              to="/rules"
              className={`font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1 ${isActive('/rules') ? 'text-mandi-earth-light' : 'text-white hover:text-mandi-earth-light'}`}
            >
              Commitment Rules
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-white/80 text-sm">{user?.name}</span>
                <Link to="/shop">
                  <Button className="bg-mandi-green text-white hover:bg-mandi-green/80 border border-white/30 hidden sm:inline-flex">
                    Shop
                  </Button>
                </Link>
                <Link to={getDashboardLink()}>
                  <Button className="bg-white/20 text-white hover:bg-white/30 border border-white/30">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/buyer-login">
                <Button className="bg-white text-mandi-green hover:bg-mandi-cream focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-mandi-green">
                  Join as Buyer
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-mandi-earth-light p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <X className="h-8 w-8" aria-hidden="true" />
              ) : (
                <Menu className="h-8 w-8" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute w-full bg-mandi-green border-t border-white/10 shadow-lg animate-fade-in"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              to="/"
              className={`block px-3 py-3 text-base font-medium rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${isActive('/') ? 'text-mandi-earth-light bg-white/10' : 'text-white hover:text-mandi-earth-light'}`}
            >
              Home
            </Link>
            {/* biome-ignore lint/a11y/useValidAnchor: Same-page navigation to anchor section */}
            <a
              href="#our-story"
              onClick={(e) => handleAnchorClick(e, 'our-story')}
              className="block px-3 py-3 text-base font-medium text-white hover:text-mandi-earth-light rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Our Story
            </a>
            {/* biome-ignore lint/a11y/useValidAnchor: Same-page navigation to anchor section */}
            <a
              href="#how-it-works"
              onClick={(e) => handleAnchorClick(e, 'how-it-works')}
              className="block px-3 py-3 text-base font-medium text-white hover:text-mandi-earth-light rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              How it Works
            </a>
            <Link
              to="/rules"
              className={`block px-3 py-3 text-base font-medium rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${isActive('/rules') ? 'text-mandi-earth-light bg-white/10' : 'text-white hover:text-mandi-earth-light'}`}
            >
              Commitment Rules
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block w-full text-center mt-4 px-5 py-3 rounded-lg bg-white/20 text-white font-bold border border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-center mt-2 px-5 py-3 rounded-lg text-white font-medium hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/buyer-login"
                className="block w-full text-center mt-4 px-5 py-3 rounded-lg bg-white text-mandi-green font-bold shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-mandi-green"
              >
                Join as Buyer
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
