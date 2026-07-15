import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDestinationBySlug, getAllDestinationSlugs, getAllItineraries } from '@/lib/getPages';
import { getSiteContent } from '@/lib/getContent';
import { resolveImageUrl } from '@/lib/resolveImage';
import { buildDestinationJsonLd } from '@/lib/jsonLd';
import { SiteChrome } from '@/components/SiteChrome';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceylonadhitours.com';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const destination = await getDestinationBySlug(params.slug);
  if (!destination) return {};
  const { content } = await getSiteContent();
  const title =
    destination.seoTitle ||
    `${destination.title} — ${content.settings.businessName}`;
  const description = destination.seoDescription || destination.summary;
  const ogImage = destination.heroImage
    ? resolveImageUrl(destination.heroImage, 1200)
    : null;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/destinations/${destination.slug}`,
      siteName: content.settings.businessName,
      images: ogImage
        ? [{ url: ogImage, width: 1200, alt: destination.title }]
        : undefined,
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const [destination, { content }, itineraries] = await Promise.all([
    getDestinationBySlug(params.slug),
    getSiteContent(),
    getAllItineraries(),
  ]);

  if (!destination) notFound();

  const { settings } = content;
  const heroImg = destination.heroImage
    ? resolveImageUrl(destination.heroImage, 1800)
    : null;
  const pageUrl = `${SITE_URL}/destinations/${destination.slug}`;
  const jsonLd = buildDestinationJsonLd(destination, pageUrl);

  // Find the specific itinerary this destination pairs well with (falls back to first).
  const pairedItinerary =
    (destination.pairedItinerarySlug &&
      itineraries.find((it) => it.slug === destination.pairedItinerarySlug)) ||
    null;

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`
    : null;
  const bookHref = settings.bookingUrl || waHref || '/#contact';

  return (
    <SiteChrome
      businessName={settings.businessName}
      areaServed={settings.areaServed}
      logo={settings.logo}
      whatsappNumber={settings.whatsappNumber}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="hero" aria-label={destination.title}>
        {heroImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero__img" src={heroImg} alt="" aria-hidden="true" />
        )}
        <div className="hero__scrim" aria-hidden="true" />
        <div className="container hero__content">
          {destination.region && (
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>
              {destination.region}
            </p>
          )}
          <h1>{destination.title}</h1>
          {destination.summary && (
            <p className="hero__sub">{destination.summary}</p>
          )}
          <div className="hero__cta">
            <a
              className="btn btn--primary"
              href={bookHref}
              target={bookHref.startsWith('http') ? '_blank' : undefined}
              rel={bookHref.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              Plan a visit
            </a>
            {waHref && (
              <a
                className="btn btn--whatsapp"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Message on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Why visit */}
      {destination.whyVisit && (
        <section className="section" aria-labelledby="why-h">
          <div className="container" style={{ maxWidth: '760px' }}>
            <p className="eyebrow">Why visit</p>
            <h2 id="why-h">About {destination.title}</h2>
            <p className="lead" style={{ whiteSpace: 'pre-line' }}>
              {destination.whyVisit}
            </p>
          </div>
        </section>
      )}

      {/* Best time to visit & getting there */}
      {(destination.bestTime || destination.gettingThere) && (
        <section className="section" aria-labelledby="plan-h">
          <div className="container" style={{ maxWidth: '760px' }}>
            <p className="eyebrow">Plan your visit</p>
            <h2 id="plan-h">When to go and how to get there</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
                marginTop: '1rem',
              }}
            >
              {destination.bestTime && (
                <div
                  style={{
                    background: 'var(--surface, #f8f9fa)',
                    borderRadius: '0.5rem',
                    padding: '1.25rem',
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>Best time to visit</h3>
                  <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{destination.bestTime}</p>
                </div>
              )}
              {destination.gettingThere && (
                <div
                  style={{
                    background: 'var(--surface, #f8f9fa)',
                    borderRadius: '0.5rem',
                    padding: '1.25rem',
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>Getting there</h3>
                  <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{destination.gettingThere}</p>
                </div>
              )}
            </div>
            <p className="muted" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
              Seasonal advice and drive times are indicative; Adhi will confirm details for your dates.
            </p>
          </div>
        </section>
      )}

      {/* Highlights */}
      {destination.highlights && destination.highlights.length > 0 && (
        <section className="section section--alt" aria-labelledby="highlights-h">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Experiences</p>
              <h2 id="highlights-h">What you will see</h2>
            </div>
            <ul
              style={{
                maxWidth: '680px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '0.75rem',
                listStyle: 'none',
                padding: 0,
              }}
            >
              {destination.highlights.map((h, i) => (
                <li
                  key={i}
                  style={{
                    background: 'var(--surface, #f8f9fa)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ color: 'var(--brand)', fontWeight: 700, flexShrink: 0 }}>+</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      {destination.faqs && destination.faqs.length > 0 && (
        <section className="section" aria-labelledby="dest-faq-h">
          <div className="container" style={{ maxWidth: '760px' }}>
            <div className="section-head">
              <p className="eyebrow">Good to know</p>
              <h2 id="dest-faq-h">Frequently asked questions</h2>
            </div>
            <div className="faq">
              {destination.faqs.map((f, i) => (
                <div
                  key={f._key || `faq-${i}`}
                  style={{
                    borderBottom: '1px solid var(--border, #e5e7eb)',
                    paddingBottom: '1.25rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                    {f.question}
                  </h3>
                  <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section" id="contact" aria-labelledby="dest-cta-h">
        <div className="container">
          <div className="contact">
            <h2 id="dest-cta-h">Visit {destination.title} with Adhi</h2>
            <p>
              Tell us your dates and preferred pace and Adhi will craft a route
              that includes {destination.title} alongside other highlights that
              suit your interests. Indicative pricing from US$80 per day.
            </p>
            <div className="contact__cta">
              <a
                className="btn btn--primary"
                style={{ background: '#fff', color: 'var(--brand)' }}
                href={bookHref}
                target={bookHref.startsWith('http') ? '_blank' : undefined}
                rel={bookHref.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                Request a quote
              </a>
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
        </div>
      </section>

      {/* Pairs well with — specific itinerary */}
      {pairedItinerary && (
        <section className="section" aria-labelledby="pairs-h">
          <div className="container" style={{ maxWidth: '760px' }}>
            <p className="eyebrow">Pairs well with</p>
            <h2 id="pairs-h">See {destination.title} on this tour</h2>
            <div
              style={{
                background: 'var(--surface, #f8f9fa)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginTop: '1rem',
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                {pairedItinerary.title}
              </h3>
              {pairedItinerary.summary && (
                <p style={{ marginTop: 0 }}>{pairedItinerary.summary}</p>
              )}
              <a
                className="btn btn--primary"
                href={`/itineraries/${pairedItinerary.slug}`}
              >
                View the {pairedItinerary.durationDays}-day itinerary
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Internal links */}
      <section className="section section--alt" aria-label="Related links">
        <div className="container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a className="btn btn--ghost" href="/destinations">
            All destinations
          </a>
          {itineraries.length > 0 && (
            <a className="btn btn--ghost" href="/itineraries">
              View all itineraries
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
