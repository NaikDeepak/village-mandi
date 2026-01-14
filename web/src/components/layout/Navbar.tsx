import { Menu, X, Wheat } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavbarProps {
    variant?: 'home' | 'internal';
}

export function Navbar({ variant = 'home' }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
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

    return (
        <nav
            className={`fixed w-full z-50 ${isScrolled ? 'bg-mandi-green shadow-md py-2' : 'bg-transparent py-4'}`}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-mandi-green rounded-lg">
                        <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg border border-white/30">
                            <Wheat className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            Virtual<span className="text-mandi-earth-light">Mandi</span>
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
                        <a
                            href="#our-story"
                            onClick={(e) => handleAnchorClick(e, 'our-story')}
                            className="font-medium text-white hover:text-mandi-earth-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
                        >
                            Our Story
                        </a>
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
                            Rules
                        </Link>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center">
                        <Link to="/login">
                            <Button className="bg-white text-mandi-green hover:bg-mandi-cream focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-mandi-green">
                                Join as Buyer
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-mandi-earth-light p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? <X className="h-8 w-8" aria-hidden="true" /> : <Menu className="h-8 w-8" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div id="mobile-menu" className="md:hidden absolute w-full bg-mandi-green border-t border-white/10 shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            to="/"
                            className={`block px-3 py-3 text-base font-medium rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${isActive('/') ? 'text-mandi-earth-light bg-white/10' : 'text-white hover:text-mandi-earth-light'}`}
                        >
                            Home
                        </Link>
                        <a
                            href="#our-story"
                            onClick={(e) => handleAnchorClick(e, 'our-story')}
                            className="block px-3 py-3 text-base font-medium text-white hover:text-mandi-earth-light rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            Our Story
                        </a>
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
                            Rules
                        </Link>
                        <Link
                            to="/login"
                            className="block w-full text-center mt-4 px-5 py-3 rounded-lg bg-white text-mandi-green font-bold shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-mandi-green"
                        >
                            Join as Buyer
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
