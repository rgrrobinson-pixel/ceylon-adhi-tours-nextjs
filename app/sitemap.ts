import type { MetadataRoute } from 'next';
import {
  getAllDestinationSlugs,
  getAllItinerarySlugs,
  getAllLandingPageSlugs,
} from '@/lib/getPages';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceylonadhitours.com';

/**
 * Dynamic sitemap. Includes the homepage, index pages, and every itinerary
 * and destination slug fetched from Sanity at request time.
 * Next.js serves this at /sitemap.xml automatically.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all slugs in parallel; fall back to empty arrays if Sanity is
  // unavailable so the sitemap still renders with at least the static pages.
  const [itinerarySlugs, destinationSlugs, landingPageSlugs] = await Promise.all([
    getAllItinerarySlugs().catch(() => [] as string[]),
    getAllDestinationSlugs().catch(() => [] as string[]),
    getAllLandingPageSlugs().catch(() => [] as string[]),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/itineraries`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/destinations`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/family-tours-sri-lanka`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/group-tours-sri-lanka`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const itineraryEntries: MetadataRoute.Sitemap = itinerarySlugs.map(
    (slug) => ({
      url: `${SITE_URL}/itineraries/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })
  );

  const destinationEntries: MetadataRoute.Sitemap = destinationSlugs.map(
    (slug) => ({
      url: `${SITE_URL}/destinations/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })
  );

  const staticLandingSlugs = new Set([
    '',
    'itineraries',
    'destinations',
    'family-tours-sri-lanka',
    'group-tours-sri-lanka',
    'studio',
  ]);

  const landingPageEntries: MetadataRoute.Sitemap = landingPageSlugs
    .filter((slug) => slug && !staticLandingSlugs.has(slug))
    .map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [
    ...staticEntries,
    ...itineraryEntries,
    ...destinationEntries,
    ...landingPageEntries,
  ];
}
