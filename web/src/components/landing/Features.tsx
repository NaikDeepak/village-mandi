import { SYSTEM_RULES } from '@shared/constants';
import { IndianRupee, Leaf, ShieldCheck, Users } from 'lucide-react';

const philosophyPoints = [
  {
    title: 'Direct Authorization',
    text: 'Traceability is our promise. No anonymous listings. Every product is linked to a verified farmer.',
    icon: Leaf,
  },
  {
    title: 'Community Protocol',
    text: 'Farmers and buyers rely on clear rules and mutual trust. We replace middlemen with transparency.',
    icon: Users,
  },
  {
    title: 'Fair Facilitation',
    text: `We ask for a transparent advance of ${SYSTEM_RULES.FACILITATION_FEE_PERCENTAGE}% on top of the Base Price. This covers the cost of truth.`,
    icon: IndianRupee,
  },
  {
    title: 'Secure Settlement',
    text: 'Our two-stage payment model ensures commitment from buyers and fair, timely settlement for farmers.',
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section id="philosophy" className="py-32 bg-mandi-dark text-white relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Header / Manifesto Title */}
          <div className="lg:col-span-4">
            <span className="text-xs font-bold tracking-[0.2em] text-mandi-green uppercase mb-4 block">
              Our Philosophy
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-medium leading-tight mb-6">
              Trust through <br /><span className="text-white/50">Radical Transparency.</span>
            </h2>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              We are not just a marketplace. We are a corrective mechanism for a broken food system.
            </p>
          </div>

          {/* Grid of Points */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {philosophyPoints.map((point) => (
                <div key={point.title} className="group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-mandi-green group-hover:text-white transition-colors duration-300 text-mandi-green">
                      <point.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold font-serif">{point.title}</h3>
                  </div>
                  <p className="text-white/60 leading-relaxed font-light pl-[3.25rem]">
                    {point.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
