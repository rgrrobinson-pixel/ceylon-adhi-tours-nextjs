import type { MetadataRoute } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceylonadhitours.com';

/**
 * robots.txt — allow all crawlers (and AI search engines) full access, but
 * keep the CMS Studio out of the index. Points crawlers to the sitemap.
 * Next.js serves this at /robots.txt automatically.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
