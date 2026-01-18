import { BATCH_STATUS } from '@shared/constants';
import { MessageCircle, CheckCircle2, Clock, Package, Truck, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const journeySteps = [
  {
    id: 1,
    status: BATCH_STATUS.OPEN,
    title: 'The Commitment',
    desc: 'You pre-book your share with a small advance. This signals demand to the farmer.',
    icon: Clock,
  },
  {
    id: 2,
    status: BATCH_STATUS.CLOSED,
    title: 'The Lock',
    desc: 'Batch closes. Orders are finalized. Farmers receive the commitment signal.',
    icon: UserCheck,
  },
  {
    id: 3,
    status: BATCH_STATUS.COLLECTED,
    title: 'The Harvest',
    desc: 'Farmers harvest only what is committed. Produce moves from Konkan/Karnataka effectively express.',
    icon: Truck,
  },
  {
    id: 4,
    status: BATCH_STATUS.DELIVERED,
    title: 'The Fulfillment',
    desc: 'You receive fresh produce. Final payment is made upon successful collection.',
    icon: Package,
  },
];

export function Steps() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] text-mandi-earth-light uppercase mb-4 block">
              The Process
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-mandi-dark leading-tight">
              How you join the circle.
            </h2>
          </div>
          <div className="hidden md:block">
            <Link to="/buyer-login">
              <Button variant="outline" className="rounded-full px-6">
                Start your journey <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[2.5rem] left-0 right-0 h-[1px] bg-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {journeySteps.map((step, index) => (
              <div
                key={step.id}
                className="relative group pt-4 md:pt-0"
              >
                {/* Timeline Dot/Icon */}
                <div className="flex items-center mb-6 md:justify-center">
                  <div className="w-20 h-20 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center relative z-10 group-hover:border-mandi-green group-hover:shadow-md transition-all duration-300">
                    <step.icon className="w-8 h-8 text-mandi-muted group-hover:text-mandi-green transition-colors" />
                    <div className="absolute top-0 right-0 w-6 h-6 bg-mandi-earth-light text-white text-[10px] font-bold flex items-center justify-center rounded-full -translate-y-1/2 translate-x-1/2">
                      {index + 1}
                    </div>
                  </div>
                  {/* Mobile connector line */}
                  {index !== journeySteps.length - 1 && (
                    <div className="md:hidden h-full w-[1px] bg-gray-200 absolute left-[2.5rem] top-[5rem] bottom-[-2rem]" />
                  )}
                </div>

                <div className="md:text-center pl-[5rem] md:pl-0">
                  <div className="text-xs font-bold text-mandi-green uppercase tracking-wider mb-2">{step.status}</div>
                  <h3 className="text-xl font-bold font-serif text-mandi-dark mb-3">
                    {step.title}
                  </h3>
                  <p className="text-mandi-muted text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-24 p-8 md:p-12 bg-gray-50 rounded-[2rem] border border-gray-100 items-center text-center">
          <h3 className="text-2xl font-serif text-mandi-dark mb-8">Simple Next Steps</h3>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="flex items-center gap-4 text-left p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-sm">
              <div className="bg-mandi-green/10 p-3 rounded-full text-mandi-green">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-mandi-dark">1. Verify</div>
                <div className="text-xs text-mandi-muted">Sign up & verify phone</div>
              </div>
            </div>

            <ArrowRight className="text-gray-300 w-6 h-6 rotate-90 md:rotate-0" />

            <div className="flex items-center gap-4 text-left p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-sm">
              <div className="bg-mandi-green/10 p-3 rounded-full text-mandi-green">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-mandi-dark">2. Connect</div>
                <div className="text-xs text-mandi-muted">Join WhatsApp group</div>
              </div>
            </div>

            <ArrowRight className="text-gray-300 w-6 h-6 rotate-90 md:rotate-0" />

            <div className="flex items-center gap-4 text-left p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-sm">
              <div className="bg-mandi-green/10 p-3 rounded-full text-mandi-green">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-mandi-dark">3. Pre-book</div>
                <div className="text-xs text-mandi-muted">Pay small advance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
