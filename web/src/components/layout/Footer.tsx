import { Link } from 'react-router-dom';
import { Mail, Wheat } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-mandi-dark text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Wheat className="h-6 w-6 text-mandi-earth-light" />
                            <span className="font-bold text-2xl tracking-tight">
                                Virtual<span className="text-mandi-earth-light">Mandi</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Batch-based agricultural aggregation. Connecting farmers directly with buyers through trust and transparency.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-mandi-earth-light">Platform</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-white">Home</Link></li>
                            <li><Link to="/rules" className="hover:text-white">Rules</Link></li>
                            <li><a href="/#how-it-works" className="hover:text-white">How it Works</a></li>
                            <li><a href="/#philosophy" className="hover:text-white">Philosophy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-mandi-earth-light">Legal</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-mandi-earth-light">Contact</h3>
                        <div className="flex items-start gap-3 mb-4 text-gray-400 text-sm">
                            <Mail className="h-5 w-5 mt-0.5 text-mandi-earth-light" />
                            <span>hello@virtualmandi.com</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-8">
                            &copy; {new Date().getFullYear()} Virtual Mandi. All rights reserved.
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>Batch-based aggregation for agricultural products.</p>
                    <div className="mt-4 md:mt-0">
                        <span className="px-2 border-r border-gray-800">Trust & Transparency</span>
                        <span className="px-2">Direct from Farmers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
