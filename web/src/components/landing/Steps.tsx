import { BATCH_STATUS } from '@shared/constants';
import { CheckCircle2, Clock, MessageCircle, Package, Truck, UserCheck } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: BATCH_STATUS.OPEN,
    desc: 'Pre-booking farm produce. Secure your harvest with an advance commitment before harvest.',
    icon: Clock,
  },
  {
    id: 2,
    title: BATCH_STATUS.CLOSED,
    desc: 'Batch cutoff reached. Orders are locked and sent to farmers for harvest & dispatch.',
    icon: UserCheck,
  },
  {
    id: 3,
    title: BATCH_STATUS.COLLECTED,
    desc: 'Fresh produce sourced significantly from Karnataka & Maharashtra regions.',
    icon: Truck,
  },
  {
    id: 4,
    title: BATCH_STATUS.DELIVERED,
    desc: 'Sorted and delivered to collection points in Pune/Mumbai. Balance payment upon collection.',
    icon: Package,
  },
];

export function Steps() {
  return (
    <div id="how-it-works" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-mandi-earth-light tracking-widest uppercase mb-3">
            Batch Lifecycle
          </h2>
          <p className="text-3xl md:text-4xl font-serif font-bold text-mandi-green tracking-tight mb-6">
            How it Works
          </p>
          <p className="text-lg text-mandi-muted leading-relaxed text-balance">
            We operate in transparent cycles called "Batches" to ensure freshness and efficiency.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[2rem] left-[10%] right-[10%] h-0.5 bg-gray-100 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col items-center text-center group">
                {/* Step Circle with Icon */}
                <div className="w-16 h-16 rounded-full bg-white border-4 border-mandi-cream flex items-center justify-center mb-6 shadow-sm group-hover:border-mandi-green/30 transition-colors duration-300 relative z-10">
                  <step.icon className="w-6 h-6 text-mandi-green" />

                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-mandi-earth-light text-white text-xs font-bold flex items-center justify-center">
                    {step.id}
                  </div>
                </div>

                {/* Vertical Line for Mobile Flow */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute top-16 bottom-[-3rem] left-1/2 w-0.5 bg-gray-100 -z-0" />
                )}

                <h3 className="text-lg font-bold text-mandi-dark mb-3">{step.title}</h3>

                <p className="text-sm text-mandi-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Post-Signup Expectations - Clean Card Grid */}
        <div className="mt-24 pt-16 border-t border-gray-100">
          <div className="text-center mb-10">
            <h3 className="text-xl font-bold text-mandi-dark">Simple next steps</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: UserCheck,
                title: '1. Verify',
                desc: 'Verify your phone number to access the dashboard.',
              },
              {
                icon: MessageCircle,
                title: '2. Connect',
                desc: 'Join the WhatsApp group for batch alerts.',
              },
              {
                icon: CheckCircle2,
                title: '3. Pre-book',
                desc: 'Pay a small advance to secure your order.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <item.icon className="w-8 h-8 text-mandi-green mb-4 opacity-80" />
                <div className="font-bold text-mandi-dark mb-2">{item.title}</div>
                <div className="text-sm text-mandi-muted text-center">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
