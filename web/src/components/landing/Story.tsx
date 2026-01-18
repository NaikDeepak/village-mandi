import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { BadgeCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Story() {
  return (
    <section id="our-story" className="py-32 bg-white text-mandi-dark overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">

        {/* Chapter Header */}
        <div className="flex flex-col items-center mb-16 animate-fade-in-up">
          <span className="text-xs font-bold tracking-[0.3em] text-mandi-earth-light uppercase mb-6">Chapter I: The Origin</span>
          <h2 className="text-4xl md:text-6xl font-serif font-medium text-center leading-tight">
            Why <span className="italic text-mandi-green">{brand.name}</span> Exists
          </h2>
        </div>

        {/* Narrative Flow - Editorial Style */}
        <div className="prose prose-xl prose-stone mx-auto text-mandi-muted/80 font-light leading-relaxed">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-mandi-dark first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px]">
            My roots go back to Ghotage in the Konkan. My father, Ramesh, is a farmer’s son who nurtured a small orchard of 50 mango trees.
          </p>
          <p>
            He watched premium fruit leave the village for prices that barely covered the effort, only
            to see it sold in cities for a fortune, with <strong className="text-mandi-dark font-medium">no connection to the grower.</strong>
          </p>

          <p>
            Attempts to connect farmers and buyers directly often failed. When harvest time arrived,
            buyers often backed out, leaving farmers with no certainty.
          </p>

          {/* The Turning Point - Pull Quote */}
          <div className="relative my-20 py-10">
            <span className="absolute top-0 left-0 text-9xl leading-none text-mandi-green/10 font-serif -translate-x-4 -translate-y-8">"</span>
            <blockquote className="relative z-10 text-3xl md:text-4xl font-serif text-mandi-dark text-center leading-snug">
              Good intentions don’t protect farmers. <span className="text-mandi-green italic">Commitment does.</span>
            </blockquote>
          </div>

          <p>
            {brand.name} exists because of that lesson. We ask for a small advance commitment.
            This enables farmers to plan with confidence and guarantees you authentic produce from
            people you can trust.
          </p>
        </div>

        {/* The Actionable Conclusion */}
        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-mandi-green mb-6 bg-mandi-green/5 px-4 py-2 rounded-full">
            <BadgeCheck className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wide uppercase">Trust Protocol Active</span>
          </div>

          <p className="text-xl md:text-2xl font-serif text-mandi-dark mb-10 max-w-lg">
            Ready to change how you eat? <br />
            <span className="text-mandi-muted text-lg font-sans font-light mt-2 block">Join the movement today.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link to="/buyer-login" className="w-full sm:w-auto">
              <Button className="w-full h-14 px-8 text-lg rounded-full bg-mandi-dark text-white hover:bg-mandi-green transition-all shadow-xl group">
                Join as Buyer <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/rules" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-14 px-8 text-lg rounded-full border-gray-200 text-mandi-dark hover:border-mandi-dark transition-all">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
