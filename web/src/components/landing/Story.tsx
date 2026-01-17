import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { Link } from 'react-router-dom';

export function Story() {
  return (
    <section id="our-story" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-base text-mandi-green font-semibold tracking-wide uppercase">
            Our Story
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-mandi-dark sm:text-4xl">
            Why {brand.name} Exists
          </p>
        </div>

        {/* The Story */}
        <div className="prose prose-lg max-w-none text-mandi-muted">
          <p className="text-xl leading-relaxed mb-6">
            I’m Deepak from Pune, but my roots go back to Ghotage in the Konkan. I’ve spent my life
            in the city, visiting the village only during holidays.
          </p>

          <p className="leading-relaxed mb-6">
            My father, Ramesh, is a farmer’s son who nurtured a small orchard of 50 mango trees. He
            watched premium fruit leave the village for prices that barely covered the effort, only
            to see it sold in cities for a fortune, with no connection to the grower.
          </p>

          <p className="leading-relaxed mb-6">
            I tried connecting farmers and buyers directly, but it failed. When harvest time
            arrived, buyers often backed out, leaving farmers with no certainty.
          </p>

          <div className="bg-mandi-cream border-l-4 border-mandi-green p-6 my-8 rounded-r-lg">
            <p className="text-mandi-dark font-medium text-lg mb-4 leading-relaxed">
              That’s when I realized: Good intentions don’t protect farmers. Commitment does.
            </p>
            <p className="text-mandi-dark font-medium text-lg mb-0 leading-relaxed">
              {brand.name} exists because of that lesson. We ask for a small advance commitment.
              This enables farmers to plan with confidence and guarantees you authentic produce from
              people you can trust.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 pt-8 border-t border-gray-100">
          <p className="text-mandi-dark font-medium mb-4">Ready to be part of something real?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg">Join as Buyer</Button>
            </Link>
            <Link to="/rules">
              <Button variant="outline" size="lg">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
