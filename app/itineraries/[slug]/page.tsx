import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getItineraryBySlug, getAllItinerarySlugs, getAllDestinations } from '@/lib/getPages';
import { getSiteContent } from '@/lib/getContent';
import { resolveImageUrl } from '@/lib/resolveImage';
import { buildItineraryJsonLd } from '@/lib/jsonLd';
import { SiteChrome } from '@/components/SiteChrome';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceylonadhitours.com';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllItinerarySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const itinerary = await getItineraryBySlug(params.slug);
  if (!itinerary) return {};

  const { content } = await getSiteContent();
  const title = itinerary.seoTitle || `${itinerary.title} — ${content.settings.businessName}`;
  const description = itinerary.seoDescription || itinerary.summary;
  const ogImage = itinerary.heroImage ? resolveImageUrl(itinerary.heroImage, 1200) : null;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: `/itineraries/${itinerary.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/itineraries/${itinerary.slug}`,
      siteName: content.settings.businessName,
      images: ogImage ? [{ url: ogImage, width: 1200, alt: itinerary.title }] : undefined,
    },
  };
}

export default async function ItineraryPage({ params }: Props) {
  const [itinerary, { content }, destinations] = await Promise.all([
    getItineraryBySlug(params.slug),
    getSiteContent(),
    getAllDestinations(),
  ]);

  if (!itinerary) notFound();

  const { settings } = content;

  const heroImgUrl = itinerary.heroImage
    ? resolveImageUrl(itinerary.heroImage, 1400)
    : null;

  const jsonLd = buildItineraryJsonLd(
    itinerary,
    SITE_URL,
    `${SITE_URL}/itineraries/${itinerary.slug}`,
  );

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Adhi, I'm interested in the ${itinerary.title} itinerary.`)}`
    : null;

  const emailHref = settings.contactEmail
    ? `mailto:${settings.contactEmail}?subject=${encodeURIComponent(`Enquiry: ${itinerary.title}`)}`
    : null;
  const inclusions = itinerary.inclusions || [];
  const exclusions = itinerary.exclusions || [];

  return (
    <SiteChrome content={content}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="section section--hero" style={heroImgUrl ? { backgroundImage: `url(${heroImgUrl})` } : undefined}>
        <div className="container">
          <p className="eyebrow">{itinerary.durationDays} days</p>
          <h1>{itinerary.title}</h1>
          {itinerary.summary && <p className="lead">{itinerary.summary}</p>}
          <div className="hero__actions">
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
            {emailHref && (
              <a className="btn btn--ghost" href={emailHref}>
                Email enquiry
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Price + highlights */}
      {(itinerary.priceNote || itinerary.bestFor) && (
        <section className="section">
          <div className="container">
            {itinerary.priceNote && (
              <p className="price-callout">{itinerary.priceNote}</p>
            )}
            {itinerary.bestFor && (
              <ul className="highlights-list">
                <li>{itinerary.bestFor}</li>
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Day-by-day */}
      {itinerary.days && itinerary.days.length > 0 && (
        <section className="section">
          <div className="container">
            <h2>Day-by-day</h2>
            <ol className="day-list">
              {itinerary.days.map((day) => (
                <li key={day._key || day.dayNumber} className="day-list__item">
                  <strong>Day {day.dayNumber}: {day.title}</strong>
                  <p>{day.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Inclusions / Exclusions */}
      {(inclusions.length > 0 || exclusions.length > 0) && (
        <section className="section">
          <div className="container incl-excl">
            {inclusions.length > 0 && (
              <div>
                <h3>Included</h3>
                <ul>
                  {inclusions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {exclusions.length > 0 && (
              <div>
                <h3>Not included</h3>
                <ul>
                  {exclusions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section section--cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to start planning?</h2>
          <p className="lead">Every itinerary is fully customisable. Talk to Adhi to design your perfect Sri Lanka journey.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {waHref && (
              <a
                className="btn btn--whatsapp"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Back link + destinations internal linking */}
      <section className="section" aria-label="Related links">
        <div className="container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a className="btn btn--ghost" href="/itineraries">
            All itineraries
          </a>
          {destinations.length > 0 && (
            <a className="btn btn--ghost" href="/destinations">
              Browse destinations
            </a>
          )}
          <a className="btn btn--ghost" href="/#faq">
            FAQ
          </a>
          <a className="btn btn--ghost" href="/#contact">
            Contact
          </a>
        </div>
      </section>
    </SiteChrome>
  );
}
