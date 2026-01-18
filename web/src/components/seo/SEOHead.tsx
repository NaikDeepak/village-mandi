import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any>;
}

export function SEOHead({
  title = 'Apna Khet – Pre-book Mangoes Directly from Konkan Farmers',
  description = 'Pre-book authentic mangoes directly from Konkan farmers. No middlemen. Secure your harvest with a small advance commitment. Fresh farm produce delivered.',
  image = 'https://apnakhet.app/og-image.jpg',
  type = 'website',
  jsonLd,
}: SEOHeadProps) {
  const location = useLocation();
  const canonicalUrl = `https://apnakhet.app${location.pathname}`;
  const siteName = 'Apna Khet';

  // structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: 'https://apnakhet.app',
    logo: 'https://apnakhet.app/logo.png',
    description: 'Direct farmer-to-consumer platform for authentic Konkan produce.',
    sameAs: [
      'https://twitter.com/apnakhet',
      'https://instagram.com/apnakhet',
      'https://wa.me/919689823838', // WhatsApp
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-968982-3838',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi', 'mr'],
    },
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Konkan Alphonso Mangoes',
    description:
      'Authentic, naturally ripened Alphonso mangoes directly from Konkan farmers. Pre-book to secure your batch.',
    brand: {
      '@type': 'Brand',
      name: 'Apna Khet',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/PreOrder',
      priceCurrency: 'INR',
      price: '1200', // Example starting price
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'what is advance commitment?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Advance commitment allows you to pay a small 10% fee to secure your produce before harvest. This helps farmers plan and guarantees you authentic produce.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where do the mangoes come from?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our mangoes are sourced directly from trusted farmers in the Konkan region (Ghotage and surrounding areas), ensuring authenticity and traceability.',
        },
      },
    ],
  };

  const defaultJsonLd = [organizationSchema, productSchema, faqSchema];

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
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
      <script type="application/ld+json">{JSON.stringify(jsonLd || defaultJsonLd)}</script>
    </Helmet>
  );
}
