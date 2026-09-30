import { useEffect } from 'react';
import { SITE_CONFIG } from '../data/servicesData';

function setMetaTag(selector, attrName, attrValue, content) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLinkTag(rel, href) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function injectJsonLd(id, schemaObject) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObject, null, 2);
}

/**
 * Enterprise SEO & Head Engine
 * Zero-latency synchronization of Document Title, Meta tags, OpenGraph, Twitter Cards, Canonical links & JSON-LD
 */
export default function SEO({
  title,
  description,
  canonicalPath = '',
  keywords,
  ogType = 'website',
  ogImage,
  ogImageAlt,
  noindex = false,
  breadcrumbs = [],
  serviceSchema,
  faqSchema,
  customSchema,
}) {
  const fullTitle = title
    ? `${title.trim()}`
    : `${SITE_CONFIG.siteName} — Premium IT Services, CCTV & AMC Kolkata`;

  const metaDesc = description
    ? description.trim()
    : 'ADM TECHNO SOLUTION (AMD IT SOLUTION) — Trusted IT partner in Kolkata for CCTV camera installation, laptop repair, networking & AMC maintenance. Call 9635006403.';

  const cleanCanonicalPath = canonicalPath.startsWith('/')
    ? canonicalPath
    : canonicalPath ? `/${canonicalPath}` : '';
  const canonicalUrl = `${SITE_CONFIG.domain}${cleanCanonicalPath}`;

  const image = ogImage || SITE_CONFIG.defaultOgImage;
  const imageAlt = ogImageAlt || `${SITE_CONFIG.siteName} Kolkata`;

  useEffect(() => {
    // 1. Title
    document.title = fullTitle;

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', metaDesc);
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    }
    setMetaTag(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    setMetaTag('meta[name="author"]', 'name', 'author', SITE_CONFIG.legalName);

    // 3. Dynamic Canonical Tag
    setLinkTag('canonical', canonicalUrl);

    // 4. Open Graph Tags
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_CONFIG.siteName);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDesc);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
    setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', imageAlt);
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_IN');

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metaDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', imageAlt);

    // 6. Universal Organization & WebSite JSON-LD
    const baseGraph = [
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${SITE_CONFIG.domain}/#organization`,
        name: SITE_CONFIG.siteName,
        alternateName: ['AMD IT SOLUTION', 'ADM Techno Solution Kolkata'],
        url: SITE_CONFIG.domain,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_CONFIG.domain}/#logo`,
          url: `${SITE_CONFIG.domain}/favicon.svg`,
          caption: 'ADM TECHNO SOLUTION Logo',
        },
        image: SITE_CONFIG.defaultOgImage,
        description: SITE_CONFIG.tagline,
        telephone: SITE_CONFIG.phone,
        email: SITE_CONFIG.email,
        priceRange: SITE_CONFIG.priceRange,
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, Credit Card, UPI, Net Banking, Razorpay',
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE_CONFIG.address.streetAddress,
          addressLocality: SITE_CONFIG.address.addressLocality,
          addressRegion: SITE_CONFIG.address.addressRegion,
          postalCode: SITE_CONFIG.address.postalCode,
          addressCountry: SITE_CONFIG.address.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: SITE_CONFIG.geo.latitude,
          longitude: SITE_CONFIG.geo.longitude,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '10:00',
            closes: '21:00',
          },
        ],
        areaServed: [
          { '@type': 'City', name: 'Kolkata' },
          { '@type': 'City', name: 'Howrah' },
          { '@type': 'AdministrativeArea', name: 'North 24 Parganas' },
          { '@type': 'AdministrativeArea', name: 'South 24 Parganas' },
          { '@type': 'AdministrativeArea', name: 'West Bengal' },
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: SITE_CONFIG.rating,
          reviewCount: String(SITE_CONFIG.reviewCount),
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.domain}/#website`,
        url: SITE_CONFIG.domain,
        name: SITE_CONFIG.siteName,
        description: SITE_CONFIG.tagline,
        publisher: {
          '@id': `${SITE_CONFIG.domain}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_CONFIG.domain}/services?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ];

    // Bind Contextual Service Schema if provided
    if (serviceSchema) {
      baseGraph.push(serviceSchema);
    }

    // Bind Contextual FAQPage Schema if provided
    if (faqSchema && faqSchema.length > 0) {
      baseGraph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqSchema.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      });
    }

    // Bind BreadcrumbList Schema if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      baseGraph.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((bc, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: bc.name,
          item: bc.url.startsWith('http') ? bc.url : `${SITE_CONFIG.domain}${bc.url}`,
        })),
      });
    }

    // Bind Custom Schema if provided
    if (customSchema) {
      if (Array.isArray(customSchema)) {
        baseGraph.push(...customSchema);
      } else {
        baseGraph.push(customSchema);
      }
    }

    const fullLdJson = {
      '@context': 'https://schema.org',
      '@graph': baseGraph,
    };

    injectJsonLd('seo-schema-root', fullLdJson);
  }, [
    fullTitle,
    metaDesc,
    canonicalUrl,
    image,
    imageAlt,
    noindex,
    keywords,
    ogType,
    serviceSchema,
    faqSchema,
    breadcrumbs,
    customSchema,
  ]);

  return null;
}
