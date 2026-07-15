import type { Metadata } from 'next';
import { getAllDestinations } from '@/lib/getPages';
import { getSiteContent } from '@/lib/getContent';
import { resolveImageUrl } from '@/lib/resolveImage';
import { SiteChrome } from '@/components/SiteChrome';
import { buildListingJsonLd } from '@/lib/jsonLd';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceylonadhitours.com';

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSiteContent();
  const title = `Destinations — ${content.settings.businessName}`;
  const description =
    'Discover the regions of Sri Lanka that Adhi knows best — from the ancient Cultural Triangle to the southern coast, Yala safari parks, and misty Ella tea country.';
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: '/destinations' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/destinations`,
      siteName: content.settings.businessName,
    },
  };
}

export default async function DestinationsPage() {
  const [{ content }, destinations] = await Promise.all([
    getSiteContent(),
    getAllDestinations(),
  ]);
  const { settings } = content;

  const jsonLd = buildListingJsonLd({
    name: `Destinations — ${settings.businessName}`,
    description:
      'The regions of Sri Lanka that Adhi knows best — the ancient Cultural Triangle and Sigiriya, the southern coast and Galle, Yala safari country, and the misty Ella tea country. Each can be combined into a private tour.',
    pageUrl: `${SITE_URL}/destinations`,
    items: destinations.map((dest) => ({
      name: dest.title,
      url: `${SITE_URL}/destinations/${dest.slug}`,
      description: dest.summary,
    })),
  });

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

      {/* Hero banner */}
      <section className="hero" aria-label="Destinations">
        <div className="hero__scrim" aria-hidden="true" />
        <div className="container hero__content">
          <h1>Destinations in Sri Lanka</h1>
          <p className="hero__sub">
            Sri Lanka packs extraordinary variety into a small island. Ancient
            fortresses, leopard country, colonial coast towns, and emerald hill
            stations — all within a day&apos;s drive of each other.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="/#contact">
              Plan your trip
            </a>
          </div>
        </div>
      </section>

      {/* Destination cards */}
      <section className="section" aria-labelledby="destinations-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Explore</p>
            <h2 id="destinations-h">Where will you go?</h2>
            <p className="lead">
              Each destination can be visited as a day trip or combined into a
              longer private tour. Ask Adhi to build a custom route around the
              places that interest you most.
            </p>
          </div>

          {destinations.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.6 }}>
              Destination guides are being added — check back soon or{' '}
              <a href="/#contact">contact us</a> directly.
            </p>
          ) : (
            <div className="cards">
              {destinations.map((dest) => {
                const img = resolveImageUrl(dest.heroImage, 800);
                return (
                  <article className="card" key={dest._id}>
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="card__img"
                        src={img}
                        alt={dest.title}
                        loading="lazy"
                      />
                    )}
                    <div className="card__body">
                      {dest.region && (
                        <p className="eyebrow" style={{ marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                          {dest.region}
                        </p>
                      )}
                      <h3>{dest.title}</h3>
                      <p className="card__desc">{dest.summary}</p>
                      {dest.highlights && dest.highlights.length > 0 && (
                        <ul style={{ paddingLeft: '1.1rem', marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.85 }}>
                          {dest.highlights.slice(0, 3).map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      )}
                      <a
                        className="btn btn--primary"
                        href={`/destinations/${dest.slug}`}
                        style={{ marginTop: '1rem', display: 'inline-block' }}
                      >
                        Learn more
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Internal link to itineraries */}
      <section className="section section--alt" aria-labelledby="dest-itin-h">
        <div className="container">
          <div className="contact">
            <h2 id="dest-itin-h">Ready to visit these places?</h2>
            <p>
              Browse our pre-planned itineraries that visit these destinations,
              or ask Adhi to design a completely custom route for your trip.
            </p>
            <div className="contact__cta">
              <a className="btn btn--primary" href="/itineraries">
                See itineraries
              </a>
              <a className="btn btn--ghost" href="/#contact">
                Request a custom tour
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
