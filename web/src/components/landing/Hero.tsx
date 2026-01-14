import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SYSTEM_RULES } from '@shared/constants';
import heroBg from '../../assets/hero-bg.png';

export function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroBg}
                    alt="Agricultural landscape"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-mandi-dark/60"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                    Virtual Mandi
                </h1>

                <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium mb-4">
                    Batch-Based Agricultural Aggregation
                </p>

                <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
                    We connect you directly with farmers through organized batch cycles.
                    Every product is traceable to its source.
                    Transparent pricing with a {SYSTEM_RULES.FACILITATION_FEE_PERCENTAGE}% facilitation fee.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link to="/login">
                        <Button size="lg" className="w-full sm:w-auto">
                            Join as Buyer
                        </Button>
                    </Link>
                    <Link to="/rules">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-mandi-dark">
                            How It Works
                        </Button>
                    </Link>
                </div>

                {/* Key Facts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-white/90">
                    <div className="text-center">
                        <div className="text-2xl font-bold">Batch Model</div>
                        <div className="text-sm text-white/70">Orders aggregated in cycles</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">10% Fee</div>
                        <div className="text-sm text-white/70">Transparent facilitation</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">Farmer-Linked</div>
                        <div className="text-sm text-white/70">Full traceability</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
