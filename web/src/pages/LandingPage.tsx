import { Features } from '../components/landing/Features';
import { Hero } from '../components/landing/Hero';
import { Stats } from '../components/landing/Stats';
import { Steps } from '../components/landing/Steps';
import { Story } from '../components/landing/Story';
import { TraceabilityDemo } from '../components/landing/TraceabilityDemo';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';

import { SEOHead } from '../components/seo/SEOHead';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead />
      <Navbar />
      <main>
        <Hero />
        <Story />
        <TraceabilityDemo />
        <Stats />
        <Steps />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
