import { Button } from '@/components/ui/button';
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
            Why Virtual Mandi Exists
          </p>
        </div>

        {/* The Story */}
        <div className="prose prose-lg max-w-none text-mandi-muted">
          <p className="text-xl leading-relaxed mb-6">
            I am Deepak. My father is the son of a farmer from Ghotage, a small village in Kokan.
          </p>

          <p className="leading-relaxed mb-6">
            I grew up watching my family sweat in the sun to grow the best mangoes and rice. But
            when harvest came, we had to sell to middlemen for almost nothing. It broke my heart.
          </p>

          <p className="leading-relaxed mb-6">
            Then I moved to the city. I saw my friends paying huge prices for the same food. They
            had no idea who grew it. They had no idea about the life behind that fruit.
          </p>

          <p className="leading-relaxed mb-6">
            So I tried to connect them. I told my friends I would bring mangoes from Ghotage. They
            said yes. They were happy. But when the mangoes were ready, they had already bought from
            the store. They said maybe next time.
          </p>

          <p className="leading-relaxed mb-6">
            But the farmer cannot wait for next time. The fruit was picked. It had to go. So it went
            back to the middleman.
          </p>

          <div className="bg-mandi-cream border-l-4 border-mandi-green p-6 my-8 rounded-r-lg">
            <p className="text-mandi-dark font-medium text-lg mb-0 leading-relaxed">
              That is why I built Virtual Mandi. Good intentions are not enough. Farmers need
              commitment.
            </p>
          </div>

          <p className="leading-relaxed mb-6">
            Here we ask for a small promise upfront. It tells the farmer you are serious. It means
            they can plan. It means they get paid what they deserve.
          </p>

          <p className="leading-relaxed mb-8">
            Every product here comes from a farmer in Kokan I know personally. You will know their
            name. You will know their story. This is real food from real people. Thank you for being
            here. Thank you for supporting us.
          </p>
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
