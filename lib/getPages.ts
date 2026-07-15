/**
 * GROQ fetchers for the multi-page content types: itineraries and destinations.
 *
 * These always fetch from Sanity directly (they have no sample-content
 * fallback – if the dataset is empty the page lists are just empty).
 * New routes are force-dynamic so changes in Studio appear immediately.
 */
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { isSanityConfigured, readToken } from '@/sanity/env';
import type { Itinerary, Destination } from './types';

const clientOpts = readToken
  ? { token: readToken, perspective: 'published' as const }
  : undefined;

// ---- ITINERARY QUERIES ----

const allItinerariesQuery = groq`*[_type == "itinerary"] | order(durationDays asc) {
  _id, title, "slug": slug.current, summary, heroImage, durationDays, bestFor, priceNote
}`;

const itineraryBySlugQuery = groq`*[_type == "itinerary" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, summary, heroImage, durationDays, bestFor,
  days[]{ _key, dayNumber, title, body },
  inclusions, exclusions, priceNote,
  faqs[]{ _key, question, answer },
  seoTitle, seoDescription
}`;

const allItinerarySlugsQuery = groq`*[_type == "itinerary"]{ "slug": slug.current }`;

// ---- DESTINATION QUERIES ----

const allDestinationsQuery = groq`*[_type == "destination"] | order(title asc) {
  _id, title, "slug": slug.current, region, summary, heroImage, highlights
}`;

const destinationBySlugQuery = groq`*[_type == "destination" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, region, summary, heroImage, whyVisit, highlights,
  bestTime, gettingThere, pairedItinerarySlug,
  faqs[]{ _key, question, answer },
  seoTitle, seoDescription
}`;

const allDestinationSlugsQuery = groq`*[_type == "destination"]{ "slug": slug.current }`;

// ---- EXPORTED FETCHERS ----

export async function getAllItineraries(): Promise<Itinerary[]> {
  if (!isSanityConfigured) return [];
  try {
    return await client.fetch<Itinerary[]>(allItinerariesQuery, {}, clientOpts);
  } catch {
    return [];
  }
}

export async function getItineraryBySlug(slug: string): Promise<Itinerary | null> {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch<Itinerary | null>(itineraryBySlugQuery, { slug }, clientOpts);
  } catch {
    return null;
  }
}

export async function getAllDestinations(): Promise<Destination[]> {
  if (!isSanityConfigured) return [];
  try {
    return await client.fetch<Destination[]>(allDestinationsQuery, {}, clientOpts);
  } catch {
    return [];
  }
}

export async function getDestinationBySlug(slug: string):
Promise<Destination | null> {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch<Destination | null>(destinationBySlugQuery, { slug }, clientOpts);
  } catch {
    return null;
  }
}

export async function getAllItinerarySlugs(): Promise<string[]> {
  if (!isSanityConfigured) return [];
  try {
    const results = await client.fetch<{ slug: string }[]>(allItinerarySlugsQuery, {}, clientOpts);
    return results.map((r) => r.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getAllDestinationSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return [];
  try {
    const results = await client.fetch<{ slug: string }[]>(allDestinationSlugsQuery, {}, clientOpts);
    return results.map((r) => r.slug).filter(Boolean);
  } catch {
    return [];
  }
}
