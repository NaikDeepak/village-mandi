import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Steps } from '../components/landing/Steps';
import { Footer } from '../components/layout/Footer';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Steps />
            </main>
            <Footer />
        </div>
    );
}
