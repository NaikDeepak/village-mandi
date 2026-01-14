import { BATCH_STATUS } from '@shared/constants';

const steps = [
  {
    id: 1,
    title: BATCH_STATUS.OPEN,
    desc: 'Pricing locked. Place your orders.',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    id: 2,
    title: BATCH_STATUS.CLOSED,
    desc: 'Cutoff reached. Orders locked.',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
  {
    id: 3,
    title: BATCH_STATUS.COLLECTED,
    desc: 'Goods sourced from farmers.',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  {
    id: 4,
    title: BATCH_STATUS.DELIVERED,
    desc: 'Distributed to buyers.',
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
                className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md text-center group"
              >
                <div
                  className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-mandi-green text-white' : 'bg-gray-200 text-gray-600'} border-4 border-white`}
                >
                  {step.id}
                </div>

                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 mt-2 ${step.color}`}
                >
                  {step.title}
                </div>

                <p className="text-mandi-muted font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
