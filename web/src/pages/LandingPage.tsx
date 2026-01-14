import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/landing/Hero';
import { Story } from '../components/landing/Story';
import { Stats } from '../components/landing/Stats';
import { Steps } from '../components/landing/Steps';
import { Features } from '../components/landing/Features';
import { Footer } from '../components/layout/Footer';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Hero />
                <Story />
                <Stats />
                <Steps />
                <Features />
            </main>
            <Footer />
        </div>
    );
}
