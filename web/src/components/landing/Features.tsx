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
    description: `We charge a nominal facilitation fee of ${SYSTEM_RULES.FACILITATION_FEE_PERCENTAGE}% on top of the Farmer's Base Price. Transparent for everyone.`,
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
    <div id="philosophy" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-mandi-green font-semibold tracking-wide uppercase">
            Our Philosophy
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-mandi-dark sm:text-4xl">
            Trust & Transparency
          </p>
          <p className="mt-4 max-w-2xl text-xl text-mandi-muted mx-auto">
            We are not just a marketplace; we are a community. Here's how we ensure fairness and
            quality.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-white rounded-2xl px-8 pb-10 h-full border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-mandi-green to-emerald-600 rounded-xl shadow-lg transform transition-transform group-hover:scale-110">
                        <feature.icon className="h-7 w-7 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-xl font-bold tracking-tight text-mandi-dark">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
