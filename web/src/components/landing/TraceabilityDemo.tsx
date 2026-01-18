import { ShieldCheck, Truck, Users } from 'lucide-react';

export function TraceabilityDemo() {
  return (
    <section className="py-24 bg-mandi-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <h2 className="text-base text-mandi-green font-semibold tracking-wide uppercase">
              Full Traceability
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-mandi-dark sm:text-4xl mb-6">
              Know Exactly Who Grows Your Food
            </p>
            <p className="text-xl text-mandi-muted leading-relaxed mb-8">
              We don't sell anonymous produce. Every batch is directly linked to a specific farmer
              and village. You'll know the harvest date, the variety, and the story behind it.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-mandi-green">
                    <ShieldCheck className="h-6 w-6" />
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-mandi-dark">Quality Guarantee</h4>
                  <p className="mt-1 text-gray-600">
                    If the produce quality isn't what we promised, we offer a fair refund or
                    replacement. Your trust is our capital.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                    <Users className="h-6 w-6" />
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-mandi-dark">Direct Connection</h4>
                  <p className="mt-1 text-gray-600">
                    Join our community. We often share updates from the farm, so you see the harvest
                    as it happens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Mock Batch Card */}
          <div className="relative">
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-72 h-72 bg-mandi-green/10 rounded-full blur-3xl opacity-70 animate-pulse" />

            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-mandi-green px-6 py-4 flex justify-between items-center">
                <span className="text-white font-bold tracking-wide">BATCH #2026-M1</span>
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
                  OPEN FOR BOOKING
                </span>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-mandi-dark">Alphonso Mangoes</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Price / Dozen</p>
                    <p className="text-xl font-bold text-mandi-dark">₹ 850</p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Farmer</p>
                      <p className="font-medium text-mandi-dark">Ramesh N. & Family</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Origin</p>
                      <p className="font-medium text-mandi-dark">Ratnagiri, Maharashtra</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-mandi-green h-2.5 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">65% Booked</span>
                    <span className="text-mandi-green font-bold">Closing in 3 days</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium">
                  Sample Batch Card • Actual availability varies
                </p>
              </div>
            </div>

            {/* Tooltip/Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-w-[200px] hidden md:block animate-bounce-slow">
              <p className="text-sm font-bold text-mandi-dark mb-1">Transparent Pricing</p>
              <p className="text-xs text-gray-500">
                We show you exactly what the farmer gets vs. our 10% advance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
