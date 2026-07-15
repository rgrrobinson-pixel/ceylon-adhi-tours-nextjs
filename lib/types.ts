/**
 * Shared content types used by both the live Sanity data and the bundled
 * fallback sample content. Image fields can be EITHER a Sanity image object
 * (when content comes from the CMS) or a plain string URL (sample content),
 * so components must handle both — see `lib/resolveImage.ts`.
 */
import type { PortableTextBlock } from 'next-sanity';

export type ImageSource =
  | string
  | { asset?: { _ref?: string }; alt?: string; [key: string]: unknown }
  | null
  | undefined;

export type SiteTheme = 'classic' | 'bold' | 'minimal';

export interface SiteSettings {
  businessName: string;
  tagline?: string;
  logo?: ImageSource;
  theme?: SiteTheme;
  primaryColor?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  areaServed?: string;
  currency?: string;
  bookingUrl?: string;
  reviewCount?: number;
  reviewsUrl?: string;
}

export interface Hero {
  headline: string;
  subheadline?: string;
  heroImage?: ImageSource;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;
}

export interface About {
  heading?: string;
  ownerName?: string;
  yearsExperience?: number;
  portrait?: ImageSource;
  // Portable Text blocks from Sanity, OR plain strings in sample content.
  body?: PortableTextBlock[] | string[];
}

export interface Service {
  _id: string;
  title: string;
  description?: string;
  priceFrom?: number;
  priceUnit?: string;
  image?: ImageSource;
  order?: number;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order?: number;
}

export interface Review {
  _id: string;
  author: string;
  ratingValue: number;
  text?: string;
  sourceName?: string;
  date?: string;
}

export interface GalleryPhoto {
  _key?: string;
  caption?: string;
  asset?: { _ref?: string };
  [key: string]: unknown;
}

export interface Gallery {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  photos?: GalleryPhoto[];
}

export interface VideoItem {
  _key?: string;
  caption?: string;
  videoUrl?: string | null;
  videoMime?: string | null;
  poster?: { asset?: { _ref?: string }; [key: string]: unknown } | null;
}

export interface VideoSection {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  videos?: VideoItem[];
  videoUrl?: string | null;
  videoMime?: string | null;
  poster?: { asset?: { _ref?: string }; [key: string]: unknown } | null;
}

export interface TourPackage {
  _key?: string;
  title: string;
  forPeople?: string;
  originalPrice?: number;
  offerPrice: number;
  perDayNote?: string;
  highlight?: boolean;
}

export interface TourPackagesSection {
  enabled?: boolean;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  packages?: TourPackage[];
  inclusions?: string[];
  exclusions?: string[];
  footnote?: string;
  ctaLabel?: string;
}

// ---- Page-level FAQ (destination & itinerary pages) ----
export interface PageFaq {
  _key?: string;
  question: string;
  answer: string;
}

// ---- Itinerary ----
export interface ItineraryDay {
  _key?: string;
  dayNumber: number;
  title: string;
  body: string;
}

export interface Itinerary {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  heroImage?: ImageSource;
  durationDays: number;
  bestFor?: string;
  days?: ItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  priceNote?: string;
  faqs?: PageFaq[];
  seoTitle?: string;
  seoDescription?: string;
}

// ---- Destination ----
export interface Destination {
  _id: string;
  title: string;
  slug: string;
  region?: string;
  summary: string;
  heroImage?: ImageSource;
  whyVisit?: string;
  highlights?: string[];
  bestTime?: string;
  gettingThere?: string;
  pairedItinerarySlug?: string;
  faqs?: PageFaq[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface SiteContent {
  settings: SiteSettings;
  hero: Hero;
  about: About;
  services: Service[];
  faqs: FaqItem[];
  reviews: Review[];
  gallery: Gallery | null;
  destinationsGallery: Gallery | null;
  videoSection: VideoSection | null;
  tourPackages: TourPackagesSection | null;
}
