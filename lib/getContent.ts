/**
 * The single source of truth for page content.
 *
 * If a real Sanity project is configured, fetch live content via GROQ.
 * Otherwise (or if a fetch fails), fall back to bundled sample content so
 * the site always builds and renders. We NEVER crash on missing env.
 */
import { client } from '@/sanity/lib/client';
import { isSanityConfigured, readToken } from '@/sanity/env';
import {
  siteSettingsQuery,
  heroQuery,
  aboutQuery,
  servicesQuery,
  faqsQuery,
  reviewsQuery,
  galleryQuery,
  destinationsGalleryQuery,
  videoSectionQuery,
  tourPackagesQuery,
} from '@/sanity/lib/queries';
import { sampleContent } from './sampleContent';
import type {
  SiteContent,
  SiteSettings,
  Hero,
  About,
  Service,
  FaqItem,
  Review,
  Gallery,
  VideoSection,
  TourPackagesSection,
} from './types';

export async function getSiteContent(): Promise<{
  content: SiteContent;
  usingSampleContent: boolean;
}> {
  if (!isSanityConfigured) {
    return { content: sampleContent, usingSampleContent: true };
  }

  try {
    const opts = readToken
      ? { token: readToken, perspective: 'published' as const }
      : undefined;

    const [
      settings,
      hero,
      about,
      services,
      faqs,
      reviews,
      gallery,
      destinationsGallery,
      videoSection,
      tourPackages,
    ] = await Promise.all([
      client.fetch<SiteSettings | null>(siteSettingsQuery, {}, opts),
      client.fetch<Hero | null>(heroQuery, {}, opts),
      client.fetch<About | null>(aboutQuery, {}, opts),
      client.fetch<Service[]>(servicesQuery, {}, opts),
      client.fetch<FaqItem[]>(faqsQuery, {}, opts),
      client.fetch<Review[]>(reviewsQuery, {}, opts),
      client.fetch<Gallery | null>(galleryQuery, {}, opts),
      client.fetch<Gallery | null>(destinationsGalleryQuery, {}, opts),
      client.fetch<VideoSection | null>(videoSectionQuery, {}, opts),
      client.fetch<TourPackagesSection | null>(tourPackagesQuery, {}, opts),
    ]);

    // If the project exists but is empty (owner hasn't added content yet),
    // fall back to sample content for anything missing so the page still
    // looks complete during setup.
    const content: SiteContent = {
      settings: settings ?? sampleContent.settings,
      hero: hero ?? sampleContent.hero,
      about: about ?? sampleContent.about,
      services: services && services.length ? services : sampleContent.services,
      faqs: faqs && faqs.length ? faqs : sampleContent.faqs,
      reviews: reviews && reviews.length ? reviews : sampleContent.reviews,
      gallery:
        gallery && gallery.photos && gallery.photos.length
          ? gallery
          : sampleContent.gallery,
      destinationsGallery:
        destinationsGallery &&
        destinationsGallery.photos &&
        destinationsGallery.photos.length
          ? destinationsGallery
          : sampleContent.destinationsGallery,
      videoSection:
        videoSection &&
        ((videoSection.videos && videoSection.videos.length) ||
          videoSection.videoUrl)
          ? videoSection
          : sampleContent.videoSection,
      // Packages: use live data whenever the document exists; otherwise fall
      // back to the sample packages so the section is visible during setup.
      tourPackages:
        tourPackages && tourPackages.packages && tourPackages.packages.length
          ? tourPackages
          : sampleContent.tourPackages,
    };

    const isEmpty = !settings && !hero && !about;
    return { content, usingSampleContent: isEmpty };
  } catch (err) {
    // Network error, bad token, etc. — degrade gracefully.
    console.warn(
      '[getSiteContent] Falling back to sample content:',
      err instanceof Error ? err.message : err
    );
    return { content: sampleContent, usingSampleContent: true };
  }
}

/** Compute aggregate rating from the reviews list. */
export function computeAggregateRating(reviews: Review[]): {
  count: number;
  average: number;
} {
  if (!reviews.length) return { count: 0, average: 0 };
  const sum = reviews.reduce((acc, r) => acc + (r.ratingValue || 0), 0);
  const average = Math.round((sum / reviews.length) * 10) / 10;
  return { count: reviews.length, average };
}
