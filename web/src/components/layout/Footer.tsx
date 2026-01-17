import { brand } from '@/config/brand';
import { Mail, MessageCircle, Wheat } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  // Replace with actual WhatsApp number
  const whatsappNumber = '919876543210';
  const whatsappMessage = encodeURIComponent(`Hi, I would like to know more about ${brand.name}.`);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer className="bg-mandi-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Wheat className="h-6 w-6 text-mandi-earth-light" aria-hidden="true" />
              <span className="font-bold text-2xl tracking-tight">
                {brand.name.split(' ')[0]}
                <span className="text-mandi-earth-light">{brand.name.split(' ')[1]}</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Batch-based aggregation for grains, spices, and seasonal fruits. Connecting farmers
              directly with buyers.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-mandi-earth-light">Platform</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-white focus:text-white focus:outline-none focus-visible:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="/#our-story"
                  className="hover:text-white focus:text-white focus:outline-none focus-visible:underline"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  className="hover:text-white focus:text-white focus:outline-none focus-visible:underline"
                >
                  How it Works
                </a>
              </li>
              <li>
                <Link
                  to="/rules"
                  className="hover:text-white focus:text-white focus:outline-none focus-visible:underline"
                >
                  Rules
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-mandi-earth-light">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="/terms"
                  className="hover:text-white focus:text-white focus:outline-none focus-visible:underline"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-white focus:text-white focus:outline-none focus-visible:underline"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-mandi-earth-light">Contact</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-white focus:text-white focus:outline-none focus-visible:underline"
                >
                  <MessageCircle className="h-5 w-5 mt-0.5 text-green-500" aria-hidden="true" />
                  <span>Chat on WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${brand.email}`}
                  className="flex items-start gap-3 hover:text-white focus:text-white focus:outline-none focus-visible:underline"
                >
                  <Mail className="h-5 w-5 mt-0.5 text-mandi-earth-light" aria-hidden="true" />
                  <span>{brand.email}</span>
                </a>
              </li>
            </ul>
            <p className="text-gray-500 text-xs mt-8">
              &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>Grains, spices, and seasonal fruits from trusted farmers.</p>
          <div className="mt-4 md:mt-0">
            <span className="px-2 border-r border-gray-800">Trust & Transparency</span>
            <span className="px-2">Direct from Farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
