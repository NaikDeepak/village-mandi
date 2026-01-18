import { SYSTEM_RULES } from '@shared/constants';
import { IndianRupee, Leaf, ShieldCheck, Users } from 'lucide-react';

const features = [
  {
    name: 'Direct from Farmers',
    description:
      'Every product is linked to a known farmer. Traceability is our promise. No anonymous listings.',
    icon: Leaf,
  },
  {
    name: 'Community Trust',
    description:
      'We operate on a commitment-driven system. Farmers and buyers rely on clear rules and mutual trust.',
    icon: Users,
  },
  {
    name: 'Fair Pricing',
    description: `We ask for a transparent advance of ${SYSTEM_RULES.FACILITATION_FEE_PERCENTAGE}% on top of the Farmer's Base Price. This covers facilitation and commitment.`,
    icon: IndianRupee,
  },
  {
    name: 'Secure System',
    description:
      'Our two-stage payment model ensures commitment and fair settlement for all parties.',
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <div id="philosophy" className="py-24 bg-mandi-cream relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="h-full w-full" width="100%" height="100%">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none" className="text-mandi-earth" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-mandi-earth-light tracking-widest uppercase mb-3">
            Our Philosophy
          </h2>
          <p className="text-3xl md:text-4xl font-serif font-bold text-mandi-green tracking-tight mb-6">
            Trust through Transparency
          </p>
          <p className="text-lg text-mandi-muted leading-relaxed text-balance">
            We are not just a marketplace; we are a community. We've replaced middlemen with
            technology and trust, ensuring fairness for everyone at the table.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-mandi-earth-light/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
                <div className="relative h-full bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center p-3 bg-mandi-green/5 rounded-xl mb-6 group-hover:bg-mandi-green group-hover:text-white transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-mandi-green group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-mandi-dark mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-mandi-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
