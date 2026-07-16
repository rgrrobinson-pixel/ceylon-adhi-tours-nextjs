import type { Metadata } from 'next';
import { getAllItineraries } from '@/lib/getPages';
import { getSiteContent } from '@/lib/getContent';
import { resolveImageUrl } from '@/lib/resolveImage';
import { SiteChrome } from '@/components/SiteChrome';
import { buildListingJsonLd } from '@/lib/jsonLd';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceylonadhitours.com';

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSiteContent();
  const title = `Itineraries — ${content.settings.businessName}`;
  const description = 'Explore our carefully crafted private Sri Lanka tour itineraries. From 7-day highlights circuits to 14-day deep-dives, every route is fully customisable.';

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: '/itineraries'
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/itineraries`,
      siteName: content.settings.businessName,
    },
  };
}

export default async function ItinerariesPage() {
  const [{ content }, itineraries] = await Promise.all([
    getSiteContent(),
    getAllItineraries(),
  ]);

  const { settings } = content;

  const jsonLd = buildListingJsonLd({
    name: `Itineraries — ${settings.businessName}`,
    description: 'Private, fully customisable Sri Lanka tour itineraries led by Adhi, from 7-day highlights circuits to 14- and 15-day deep-dives. Indicative pricing from US$80 per day.',
    pageUrl: `${SITE_URL}/itineraries`,
    items: itineraries.map((it) => ({
      name: it.title,
      url: `${SITE_URL}/itineraries/${it.slug}`,
    })),
  });

  return (
    <SiteChrome content={content}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="section section--hero">
        <div className="container">
          <p className="eyebrow">Sri Lanka private tours</p>
          <h1>Itineraries</h1>
          <p className="lead">
            Every journey is built around you. Choose a route below as your starting point — we&apos;ll tailor the pace, accommodation, and experiences to match your travel style and budget.
          </p>
        </div>
      </section>

      {/* Itinerary cards */}
      <section className="section" aria-label="Itinerary list">
        <div className="container">
          <div className="card-grid">
            {itineraries.map((it) => {
              const imgUrl = it.heroImage
                ? resolveImageUrl(it.heroImage, 800)
                : null;
              const waHref = settings.whatsappNumber
                ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Adhi, I'm interested in the ${it.title} itinerary.`)}`
                : null;
              return (
                <article key={it.slug} className="card">
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={
                        typeof it.heroImage === 'object' && it.heroImage?.alt
                          ? it.heroImage.alt
                          : it.title
                      }
                      className="card__img"
                      loading="lazy"
                    />
                  )}
                  <div className="card__body">
                    <p className="eyebrow">{it.durationDays} days</p>
                    <h2 className="card__title">
                      <a href={`/itineraries/${it.slug}`}>{it.title}</a>
                    </h2>
                    {it.summary && <p className="card__summary">{it.summary}</p>}
                    {it.priceNote && (
                      <p className="card__price">{it.priceNote}</p>
                    )}
                    <div className="card__actions">
                      <a className="btn" href={`/itineraries/${it.slug}`}>
                        View itinerary
                      </a>
                      {waHref && (
                        <a
                          className="btn btn--whatsapp"
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp Adhi
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Internal links to destinations */}
      <section className="section" aria-labelledby="it-dest-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Explore the regions</p>
            <h2 id="it-dest-h">Destinations covered</h2>
            <p className="lead">
              These itineraries visit Sri Lanka&apos;s most rewarding regions.
              Read about each destination to plan your stops.
            </p>
          </div>
          <p style={{ textAlign: 'center' }}>
            <a className="btn btn--ghost" href="/destinations">
              Browse all destinations
            </a>
          </p>
        </div>
      </section>
    </SiteChrome>
  );
}
