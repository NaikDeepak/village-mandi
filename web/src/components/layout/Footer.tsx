import { Facebook, Twitter, Instagram, Mail, Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="font-bold text-2xl tracking-tight">
                                Virtual<span className="text-green-500">Mandi</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Connecting farmers directly with communities through trust, transparency, and technology.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-500">Platform</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-green-400 transition-colors">Browse Batches</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">How it Works</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Farmer Stories</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-500">Support</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-500">Get in Touch</h3>
                        <div className="flex items-start gap-3 mb-4 text-gray-400 text-sm">
                            <Mail className="h-5 w-5 mt-0.5 text-green-500" />
                            <span>hello@virtualmandi.com</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-8">
                            &copy; {new Date().getFullYear()} Virtual Mandi. All rights reserved.
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>Built with <Heart className="h-3 w-3 inline text-red-500 mx-1" /> for local communities.</p>
                    <div className="mt-4 md:mt-0">
                        <span className="px-2 border-r border-gray-800">Trust & Transparency</span>
                        <span className="px-2">Direct from Farmers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
