/**
 * Build JSON-LD structured data automatically FROM the CMS content.
 *
 * Also exports helpers for TouristTrip (itinerary pages) and
 * TouristDestination (destination pages).
 *
 * The schema always mirrors what is visible on the page — when the owner
 * edits content in the Studio, the structured data updates with it. We never
 * invent fields that aren't shown on the page.
 *
 * Produces a @graph with:
 *   - LocalBusiness / TravelAgency (name, areaServed, priceRange, founder,
 *     aggregateRating computed from the reviews)
 *   - Review nodes (one per visible review)
 *   - FAQPage built from the FAQ items
 */
import type { SiteContent, Itinerary, Destination } from './types';
import { computeAggregateRating } from './getContent';

export function buildJsonLd(content: SiteContent, siteUrl: string) {
  const { settings, about, services, faqs, reviews } = content;
  const { count, average } = computeAggregateRating(reviews);

  const currency = settings.currency || 'USD';

  // priceRange derived from the lowest service "from" price actually shown.
  const fromPrices = services
    .map((s) => s.priceFrom)
    .filter((n): n is number => typeof n === 'number');
  const minPrice = fromPrices.length ? Math.min(...fromPrices) : undefined;

  const businessId = `${siteUrl}#business`;

  const business: Record<string, unknown> = {
    '@type': ['TravelAgency', 'LocalBusiness'],
    '@id': businessId,
    name: settings.businessName,
    url: siteUrl,
  };

  if (settings.tagline) business.description = settings.tagline;
  if (settings.areaServed) business.areaServed = settings.areaServed;
  if (settings.contactEmail) business.email = settings.contactEmail;
  if (settings.contactPhone) business.telephone = settings.contactPhone;
  if (minPrice !== undefined) {
    business.priceRange = `from ${currency} ${minPrice}`;
  }
  if (about.ownerName) {
    business.founder = { '@type': 'Person', name: about.ownerName };
  }
  const aggregateCount = settings.reviewCount ?? count;
  if (aggregateCount > 0) {
    business.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: average,
      reviewCount: aggregateCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Reviews as separate nodes, linked to the business via itemReviewed.
  const reviewNodes = reviews.map((r) => {
    const node: Record<string, unknown> = {
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.ratingValue,
        bestRating: 5,
        worstRating: 1,
      },
      itemReviewed: { '@id': businessId },
    };
    if (r.text) node.reviewBody = r.text;
    if (r.date) node.datePublished = r.date;
    if (r.sourceName) {
      node.publisher = { '@type': 'Organization', name: r.sourceName };
    }
    return node;
  });

  // FAQPage from the FAQ items.
  const faqPage =
    faqs.length > 0
      ? {
          '@type': 'FAQPage',
          '@id': `${siteUrl}#faq`,
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  const graph: Record<string, unknown>[] = [business, ...reviewNodes];
  if (faqPage) graph.push(faqPage);

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/**
 * CollectionPage + ItemList JSON-LD for a listing page
 * (/itineraries or /destinations). Links to each child page so AI search
 * and crawlers understand the collection and its members.
 *
 * spec: https://schema.org/CollectionPage, https://schema.org/ItemList
 */
export function buildListingJsonLd(
  opts: {
    name: string;
    description: string;
    pageUrl: string;
    items: { name: string; url: string; description?: string }[];
  },
) {
  const { name, description, pageUrl, items } = opts;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': pageUrl,
        name,
        description,
        url: pageUrl,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: items.length,
          itemListElement: items.map((it, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: it.url,
            name: it.name,
            ...(it.description ? { description: it.description } : {}),
          })),
        },
      },
    ],
  };
}

/**
 * Expand an itinerary's day entries into one ListItem per ACTUAL day.
 *
 * The CMS stores day segments where one entry can span several days, with
 * `dayNumber` being the segment's starting day and a title like
 * "Days 1–3: Airport → Sigiriya". For cleaner AI extraction we emit one
 * ListItem per calendar day. The span of a segment is inferred from the next
 * segment's starting dayNumber (or the itinerary's total duration for the
 * final segment).
 */
function expandItineraryDays(
  days: NonNullable<Itinerary['days']>,
  totalDays?: number,
): { position: number; name: string; description?: string }[] {
  const out: { position: number; name: string; description?: string }[] = [];
  const sorted = [...days].sort((a, b) => a.dayNumber - b.dayNumber);

  // Strip a leading "Day(s) X[–Y]:" label from the title so the per-day name
  // reads cleanly (e.g. "Airport → Sigiriya").
  const cleanTitle = (t: string) =>
    t.replace(/^\s*Days?\s*\d+(?:\s*[–—-]\s*\d+)?\s*[:.–—-]\s*/i, '').trim() || t;

  sorted.forEach((seg, i) => {
    const start = seg.dayNumber;
    const next = sorted[i + 1];
    const end = next
      ? next.dayNumber - 1
      : totalDays && totalDays >= start
        ? totalDays
        : start;
    const label = cleanTitle(seg.title);
    const span = end - start + 1;
    for (let d = start; d <= end; d++) {
      // For a multi-day segment, qualify each day so the schema does not imply
      // several identical days. Day 1 of the segment keeps the route + body;
      // subsequent days are framed as continued time in the same area.
      let name = `Day ${d}: ${label}`;
      let description = seg.body;
      if (span > 1) {
        const offset = d - start; // 0-based position within the segment
        if (offset === 0) {
          name = `Day ${d}: ${label}`;
          description = `${seg.body} This leg covers Days ${start}–${end}.`;
        } else {
          const place = arrivalPlace(label);
          name = place
            ? `Day ${d}: Exploring ${place} (Day ${offset + 1} of ${span})`
            : `Day ${d}: ${label} (Day ${offset + 1} of ${span})`;
          description = place
            ? `Continued time around ${place} — day ${offset + 1} of the ${start}–${end} leg, at your own pace with sightseeing and free time as you prefer.`
            : `${seg.body} Day ${offset + 1} of the ${start}–${end} leg.`;
        }
      }
      out.push({ position: d, name, description });
    }
  });
  return out;
}

// Pull the arrival place from a route label like "Negombo → Sigiriya" (returns
// "Sigiriya"). Falls back to undefined if there's no arrow.
function arrivalPlace(label: string): string | undefined {
  const parts = label.split(/[→>]/).map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return undefined;
  // Strip any trailing parenthetical like "(approx. 4 hours)".
  return parts[parts.length - 1].replace(/\s*\(.*\)\s*$/, '').trim() || undefined;
}

/**
 * TouristTrip JSON-LD for an itinerary page.
 *
 * spec: https://schema.org/TouristTrip
 */
export function buildItineraryJsonLd(
  itinerary: Itinerary,
  siteUrl: string,
  pageUrl: string,
) {
  const provider = {
    '@type': 'TravelAgency',
    name: 'Ceylon Adhi Tours',
    url: siteUrl,
  };

  const faqPage =
    itinerary.faqs && itinerary.faqs.length > 0
      ? {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: itinerary.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'TouristTrip',
      '@id': pageUrl,
      name: itinerary.title,
      description: itinerary.summary,
      provider,
      ...(itinerary.days && itinerary.days.length > 0
        ? (() => {
            const expanded = expandItineraryDays(
              itinerary.days,
              itinerary.durationDays,
            );
            return {
              itinerary: {
                '@type': 'ItemList',
                numberOfItems: expanded.length,
                itemListElement: expanded.map((d) => ({
                  '@type': 'ListItem',
                  position: d.position,
                  name: d.name,
                  ...(d.description ? { description: d.description } : {}),
                })),
              },
            };
          })()
        : {}),
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        description:
          itinerary.priceNote ||
          `Indicative pricing from US$80 per day. Contact us for a personalised quote.`,
        seller: provider,
      },
    },
  ];

  if (faqPage) graph.push(faqPage);

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/**
 * TouristDestination JSON-LD for a destination page.
 *
 * spec: https://schema.org/TouristDestination
 */
export function buildDestinationJsonLd(
  destination: Destination,
  pageUrl: string,
) {
  const node: Record<string, unknown> = {
    '@type': 'TouristDestination',
    '@id': pageUrl,
    name: destination.title,
    description: destination.summary,
  };

  if (destination.whyVisit) {
    node.abstract = destination.whyVisit;
  }

  if (destination.highlights && destination.highlights.length > 0) {
    node.includesAttraction = destination.highlights.map((h) => ({
      '@type': 'TouristAttraction',
      name: h,
    }));
  }

  const graph: Record<string, unknown>[] = [node];

  if (destination.faqs && destination.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: destination.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
