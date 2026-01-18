import { BATCH_STATUS } from '@shared/constants';
import { MessageCircle, Phone } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: BATCH_STATUS.OPEN,
    desc: 'You pre-book with a small advance and choose quantity. Booking window: 5-7 days.',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    id: 2,
    title: BATCH_STATUS.CLOSED,
    desc: 'Batch cutoff reached. Orders are locked and sent to farmers for harvest & dispatch.',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
  {
    id: 3,
    title: BATCH_STATUS.COLLECTED,
    desc: 'Fresh produce sourced significantly from Karnataka & Maharashtra regions.',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  {
    id: 4,
    title: BATCH_STATUS.DELIVERED,
    desc: 'Sorted and delivered to collection points in Pune/Mumbai. Balance payment upon collection.',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
];

export function Steps() {
  return (
    <div id="how-it-works" className="py-24 bg-mandi-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="text-base text-mandi-green font-semibold tracking-wide uppercase">
            Batch Lifecycle
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-mandi-dark sm:text-4xl">
            How it Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-mandi-muted lg:mx-auto">
            We operate in cycles called "Batches" to ensure freshness and efficiency.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-0 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center group z-10"
              >
                <div
                  className={`absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-md transition-colors duration-300 ${
                    index === 0
                      ? 'bg-mandi-green text-white ring-4 ring-mandi-green/20'
                      : 'bg-white text-gray-500 border border-gray-200 group-hover:border-mandi-green group-hover:text-mandi-green'
                  }`}
                >
                  {step.id}
                </div>

                <div
                  className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-5 mt-4 tracking-wide shadow-sm ${step.color}`}
                >
                  {step.title}
                </div>

                <p className="text-gray-600 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Post-Signup Expectations */}
        <div className="mt-20 max-w-3xl mx-auto text-center border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold text-mandi-dark mb-6">What happens after you join?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-100 p-2 rounded-full text-green-600">
                  <Phone className="w-4 h-4" />
                </span>
                <p className="font-bold text-mandi-dark">1. Verify</p>
              </div>
              <p className="text-sm text-gray-600">
                Verify your phone number to access the buyer dashboard.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-100 p-2 rounded-full text-green-600">
                  <MessageCircle className="w-4 h-4" />
                </span>
                <p className="font-bold text-mandi-dark">2. Connect</p>
              </div>
              <p className="text-sm text-gray-600">
                Join the WhatsApp group for real-time batch announcements.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-100 p-2 rounded-full text-green-600">
                  <span className="font-bold">₹</span>
                </span>
                <p className="font-bold text-mandi-dark">3. Pre-book</p>
              </div>
              <p className="text-sm text-gray-600">
                Pay a small advance to secure your order when a batch opens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
