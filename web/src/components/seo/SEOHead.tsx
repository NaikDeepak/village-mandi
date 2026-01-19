import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, unknown>;
}

export function SEOHead({
  title = 'Apna Khet - Fresh Farm Produce Directly to You',
  description = 'Connect directly with local farmers. Buy fresh, high-quality produce with full transparency and traceability.',
  keywords = 'organic, farm fresh, direct from farmer, agriculture, apna khet, sustainable farming',
  image = 'https://apnakhet.app/og-image.jpg',
  type = 'website',
  jsonLd,
}: SEOHeadProps) {
  const location = useLocation();
  const canonicalUrl = `https://apnakhet.app${location.pathname}`;
  const siteName = 'Apna Khet';

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: 'https://apnakhet.app',
    logo: 'https://apnakhet.app/logo.png',
    sameAs: ['https://twitter.com/apnakhetapp', 'https://instagram.com/apnakhetapp'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-1234567890',
      contactType: 'customer service',
    },
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd).replace(/</g, '\\u003c')}
      </script>
    </Helmet>
  );
}
