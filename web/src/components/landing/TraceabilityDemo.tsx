import { ShieldCheck, MapPin, Calendar, QrCode } from 'lucide-react';
import { brand } from '@/config/brand';

export function TraceabilityDemo() {
    return (
        <section className="py-24 bg-mandi-cream/30 border-y border-mandi-green/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

                    {/* Left: Narrative - "The Technology of Trust" */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border-l-2 border-mandi-green pl-4">
                            <span className="text-xs font-bold tracking-[0.2em] text-mandi-green uppercase">
                                The Proof
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-mandi-dark mb-8 leading-tight">
                            We built the technology <br />
                            to keep <span className="text-mandi-green italic">the promise.</span>
                        </h2>

                        <p className="text-lg text-mandi-muted leading-relaxed mb-10 font-light text-balance">
                            Trust isn't just a feeling; it's a verifiable fact. Every crate that leaves the village carries a digital passport. You don't just buy "mangoes"—you buy a specific harvest from a specific family.
                        </p>

                        <div className="space-y-8">
                            <div className="group flex gap-6 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-mandi-green/10 text-mandi-green group-hover:bg-mandi-green group-hover:text-white transition-colors duration-300">
                                        <QrCode className="h-6 w-6" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-mandi-dark mb-2">Scan & Verify</h4>
                                    <p className="text-mandi-muted leading-relaxed text-sm">
                                        Every delivery comes with a QR code. Scan it to see the farm, the harvest date, and the journey your food took.
                                    </p>
                                </div>
                            </div>

                            <div className="group flex gap-6 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-mandi-dark mb-2">Zero Anonymity</h4>
                                    <p className="text-mandi-muted leading-relaxed text-sm">
                                        We never blend batches. If you order from Ramesh, you get Ramesh's produce. Authentic, every single time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Premium "Certificate" Card Visualization */}
                    <div className="order-1 lg:order-2 relative perspective-1000">
                        {/* Ambient Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-mandi-green/10 via-amber-500/5 to-transparent rounded-full blur-[80px] opacity-60" />

                        {/* The "Certificate" Card */}
                        <div className="relative bg-[#fffbf7] rounded-[2rem] shadow-2xl border border-stone-200 overflow-hidden transform rotate-1 hover:rotate-0 transition-all duration-700 ease-out group max-w-md mx-auto">

                            {/* Texture Overlay */}
                            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] mix-blend-multiply pointer-events-none"></div>

                            {/* Header */}
                            <div className="relative px-8 pt-8 pb-4 border-b border-stone-200/60 dashed-border-bottom">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase mb-1">Certificate of Origin</div>
                                        <h3 className="text-2xl font-serif font-bold text-stone-800">Alphonso #2026-M1</h3>
                                    </div>
                                    <div className="bg-mandi-green/10 text-mandi-green p-2 rounded-lg">
                                        <QrCode className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>

                            {/* Body Information */}
                            <div className="relative p-8 space-y-6">
                                {/* Farmer Row */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-mandi-green"></div>
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Certified Grower</p>
                                        <p className="font-serif text-xl text-stone-800">Ramesh N. & Family</p>
                                        <p className="text-sm text-stone-500 mt-1">Member since 2018 • 4.9/5 Rating</p>
                                    </div>
                                </div>

                                {/* Location Row */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-stone-300"></div>
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Origin Location</p>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-stone-400" />
                                            <p className="text-base text-stone-700 font-medium">Ghotage, Ratnagiri District, MH</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Harvest Row */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-stone-300"></div>
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Expected Harvest</p>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-stone-400" />
                                            <p className="text-base text-stone-700 font-medium">April 15th - April 20th, 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stamp Footer */}
                            <div className="relative bg-stone-100/50 px-8 py-4 border-t border-stone-200 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-stone-400 font-bold tracking-widest uppercase">Verified By</p>
                                    <p className="text-xs text-stone-600 font-bold">{brand.name} Protocol</p>
                                </div>
                                {/* The Stamp */}
                                <div className="w-16 h-16 rounded-full border-2 border-mandi-green/30 text-mandi-green/40 flex items-center justify-center -rotate-12 absolute right-6 top-2 mix-blend-multiply opacity-80">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-none">Original<br />Grade A</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
