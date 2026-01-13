import heroBg from '../../assets/hero-bg.png';

export function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroBg}
                    alt="Peaceful village hillside"
                    className="w-full h-full object-cover"
                />
                {/* Subtle overlay to ensure text readability if needed, but keeping it light to show off art */}
                <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-fade-in-up drop-shadow-sm">
                    Discover the Hidden Gems <br />
                    of Hillside Villages
                </h1>

                <p className="mt-4 text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-sm mb-10">
                    Escape to breathtaking views, charming local traditions, and sustainable lifestyles in Virtual Mandi's picturesque network.
                </p>

                <div className="flex justify-center">
                    <button className="px-10 py-4 rounded-full bg-eco-yellow text-eco-dark font-bold text-lg shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-all transform hover:-translate-y-1">
                        Start Exploring
                    </button>
                </div>

                {/* Decorative lines (simple CSS based on the reference) */}
                <div className="hidden lg:block absolute right-10 top-1/2 w-64 h-px bg-white/40"></div>
                <div className="hidden lg:block absolute right-24 top-[55%] w-48 h-px bg-white/40"></div>
            </div>
        </div>
    );
}
