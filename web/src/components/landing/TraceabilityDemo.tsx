import { ChevronRight, ShieldCheck, Truck, Users } from 'lucide-react';

export function TraceabilityDemo() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mandi-green/5 text-mandi-green text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-mandi-green animate-pulse" />
              Full Traceability
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-bold text-mandi-green-dark mb-6 leading-tight">
              Know the hands that <br />
              <span className="text-mandi-green-light">grew your food.</span>
            </h2>

            <p className="text-xl text-mandi-muted leading-relaxed mb-10 font-light text-balance">
              We don't sell anonymous produce. Every batch is an open book—linked to a specific
              family, village, and harvest date. You're not just buying food; you're acknowledging a
              relationship.
            </p>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-mandi-green/10 text-mandi-green">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-mandi-dark mb-2">Quality Guarantee</h4>
                  <p className="text-mandi-muted leading-relaxed">
                    If the produce quality isn't what we promised, we offer a fair refund or
                    replacement. Your trust is our capital.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-600">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-mandi-dark mb-2">Direct Connection</h4>
                  <p className="text-mandi-muted leading-relaxed">
                    Join our community. We often share updates from the farm, so you see the harvest
                    as it happens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Premium Batch Card Visualization */}
          <div className="order-1 lg:order-2 relative perspective-1000">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-mandi-green-light/20 via-mandi-earth-light/10 to-transparent rounded-full blur-3xl opacity-60" />

            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-700 ease-out group">
              {/* Status Bar */}
              <div className="bg-mandi-green px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-bold tracking-wider opacity-90">
                    BATCH #2026-M1
                  </span>
                </div>
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  OPEN FOR BOOKING
                </span>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-mandi-dark mb-1">
                      Alphonso Mangoes
                    </h3>
                    <p className="text-mandi-muted text-sm">Premium Grade A • Organic Practice</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-mandi-muted uppercase tracking-wide mb-1">
                      Price / Dozen
                    </p>
                    <p className="text-2xl font-bold text-mandi-green">₹ 850</p>
                  </div>
                </div>

                {/* Meta Data Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-mandi-green/20 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-4 h-4 text-mandi-green" />
                      <span className="text-xs font-bold text-mandi-muted uppercase">Farmer</span>
                    </div>
                    <p className="font-semibold text-mandi-dark">Ramesh N. & Family</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-mandi-green/20 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="w-4 h-4 text-mandi-green" />
                      <span className="text-xs font-bold text-mandi-muted uppercase">Origin</span>
                    </div>
                    <p className="font-semibold text-mandi-dark">Ratnagiri, MH</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-mandi-dark">65% Reserved</span>
                    <span className="text-mandi-earth-light">Closing soon</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-mandi-green h-full rounded-full w-[65%] relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center group-hover:bg-mandi-green/5 transition-colors">
                <span className="text-xs text-mandi-muted font-medium">Full details available</span>
                <ChevronRight className="w-4 h-4 text-mandi-muted group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 max-w-[240px] hidden md:block animate-bounce-slow">
              <p className="text-sm font-bold text-mandi-dark mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-mandi-green" />
                Transparent Pricing
              </p>
              <p className="text-xs text-mandi-muted leading-snug">
                You see exactly what the farmer earns. We keep only a small facilitation fee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
