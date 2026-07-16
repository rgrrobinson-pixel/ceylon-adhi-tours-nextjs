import { getSiteContent, computeAggregateRating } from '@/lib/getContent';
import { buildJsonLd } from '@/lib/jsonLd';
import { resolveImageUrl } from '@/lib/resolveImage';
import { Stars } from '@/components/Stars';
import { LogoMark } from '@/components/Logo';
import { AboutBody } from '@/components/AboutBody';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

// Render on every request so edits published in Studio appear immediately
// without needing a redeploy.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function whatsappHref(num?: string) {
  if (!num) return undefined;
  const digits = num.replace(/[^0-9]/g, '');
  return digits ? `https://wa.me/${digits}` : undefined;
}

export default async function HomePage() {
  const { content, usingSampleContent } = await getSiteContent();
  const { settings, hero, about, services, faqs, reviews, gallery, destinationsGallery, videoSection, tourPackages } = content;
  const { count, average } = computeAggregateRating(reviews);

  const galleryPhotos = (gallery?.photos || [])
    .map((p) => ({
      url: resolveImageUrl(p, 900),
      caption: p.caption,
      key: p._key,
    }))
    .filter((p) => Boolean(p.url)) as {
    url: string;
    caption?: string;
    key?: string;
  }[];

  const destinationsPhotos = (destinationsGallery?.photos || [])
    .map((p) => ({
      url: resolveImageUrl(p, 900),
      caption: p.caption,
      key: p._key,
    }))
    .filter((p) => Boolean(p.url)) as {
    url: string;
    caption?: string;
    key?: string;
  }[];

  // Build a normalised list of videos. Prefer the multi-video array; fall
  // back to the legacy single-video fields so existing content keeps working.
  const videoItems: {
    key: string;
    url: string;
    mime: string;
    poster: string;
    caption: string;
  }[] = [];
  if (videoSection?.videos && videoSection.videos.length) {
    videoSection.videos.forEach((v, i) => {
      if (!v?.videoUrl) return;
      videoItems.push({
        key: v._key || `video-${i}`,
        url: v.videoUrl,
        mime: v.videoMime || 'video/mp4',
        poster: (v.poster ? resolveImageUrl(v.poster, 1280) : '') || '',
        caption: v.caption || '',
      });
    });
  } else if (videoSection?.videoUrl) {
    videoItems.push({
      key: 'legacy-video',
      url: videoSection.videoUrl,
      mime: videoSection.videoMime || 'video/mp4',
      poster:
        (videoSection.poster
          ? resolveImageUrl(videoSection.poster, 1280)
          : '') || '',
      caption: videoSection.subheading || '',
    });
  }
  const hasVideos = videoItems.length > 0;

  const packagesList = tourPackages?.packages || [];
  const showPackages =
    !!tourPackages && tourPackages.enabled !== false && packagesList.length > 0;

  const heroImg = resolveImageUrl(hero.heroImage, 1800);
  const portraitImg = resolveImageUrl(about.portrait, 800);
  const logoUrl = settings.logo ? resolveImageUrl(settings.logo, 480) : null;
  const currency = settings.currency || 'USD';
  const currencySymbol = currency === 'USD' ? 'US$' : `${currency} `;
  const vehicleImage =
    (tourPackages?.vehicleImage
      ? resolveImageUrl(tourPackages.vehicleImage, 1200)
      : '') || '/adhi-van-interior.jpg';
  const vehicleHeading =
    tourPackages?.vehicleHeading || 'Travelling as a larger group or family?';
  const vehicleText =
    tourPackages?.vehicleText ||
    "For couples and small groups of up to about 3 people, Adhi's comfortable air-conditioned car is ideal. For bigger groups and families, his air-conditioned Toyota van has plenty of room, plus luggage, so everyone travels together — indicative van rate from around US$90 per day. Just tell him your group size and he'll arrange the right vehicle.";

  const waHref = whatsappHref(settings.whatsappNumber);
  const bookHref = settings.bookingUrl || waHref || '#contact';
  const ctaLink = hero.primaryCtaLink || '#contact';

  const jsonLd = buildJsonLd(content, SITE_URL);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {usingSampleContent && (
        <div className="setup-banner" role="status">
          Showing sample content. Connect your Sanity project and edit your real
          content at <a href="/studio">/studio</a>.
        </div>
      )}

      {/* Header */}
      <header className="site-header">
        <div className="container site-header__inner">
          <a
            className={`brand${logoUrl ? ' brand--has-logo' : ''}`}
            href="#top"
            aria-label={settings.businessName}
          >
            {logoUrl ? (
              <img
                className="brand__logo"
                src={logoUrl}
                alt={settings.businessName}
              />
            ) : (
              <>
                <LogoMark />
                <span>{settings.businessName}</span>
              </>
            )}
          </a>
          <nav className="nav" aria-label="Primary">
            <a href="#about">About</a>
            {showPackages ? (
              <a href="#packages">Tours</a>
            ) : (
              <a href="#services">Tours</a>
            )}
            <a href="/itineraries">Itineraries</a>
            <a href="/destinations">Destinations</a>
            <a href="#reviews">Reviews</a>
            {galleryPhotos.length > 0 && <a href="#gallery">Gallery</a>}
            {hasVideos && <a href="#watch">Watch</a>}
            <a href="#activities">Activities</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </nav>
          <details className="nav-mobile">
            <summary aria-label="Open menu">
              <span className="nav-mobile__bars" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span className="nav-mobile__label">Menu</span>
            </summary>
            <nav className="nav-mobile__panel" aria-label="Mobile">
              <a href="#about">About</a>
              {showPackages ? (
                <a href="#packages">Tours</a>
              ) : (
                <a href="#services">Tours</a>
              )}
              <a href="/itineraries">Itineraries</a>
              <a href="/destinations">Destinations</a>
              <a href="#reviews">Reviews</a>
              {galleryPhotos.length > 0 && <a href="#gallery">Gallery</a>}
              {hasVideos && <a href="#watch">Watch</a>}
              <a href="#activities">Activities</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="hero" aria-label="Introduction">
          {heroImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="hero__img"
              src={heroImg}
              alt=""
              aria-hidden="true"
            />
          )}
          <div className="hero__scrim" aria-hidden="true" />
          <div className="container hero__content">
            <h1>{hero.headline}</h1>
            {hero.subheadline && <p className="hero__sub">{hero.subheadline}</p>}
            <div className="hero__cta">
              <a className="btn btn--primary" href={ctaLink}>
                {hero.primaryCtaLabel || 'Get in touch'}
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

        {/* About */}
        <section className="section" id="about" aria-labelledby="about-h">
          <div className="container about__grid">
            {portraitImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="about__portrait"
                src={portraitImg}
                alt={
                  about.ownerName
                    ? `Photo of ${about.ownerName}`
                    : 'Your guide'
                }
              />
            )}
            <div>
              <p className="eyebrow">{about.heading || 'About'}</p>
              <h2 id="about-h">
                {about.ownerName
                  ? `Meet ${about.ownerName}`
                  : 'A little about us'}
              </h2>
              <div className="lead">
                <AboutBody body={about.body} />
              </div>
              {typeof about.yearsExperience === 'number' && (
                <div className="stat">
                  <strong>{about.yearsExperience}+</strong>
                  <span>years showing visitors around</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Services / Tours */}
        {/* "Ways to explore" hidden — Tour Packages is the primary offering.
           Set the condition back to services.length > 0 to restore it. */}
        {false && services.length > 0 && (
          <section
            className="section section--alt"
            id="services"
            aria-labelledby="services-h"
          >
            <div className="container">
              <div className="section-head">
                <p className="eyebrow">Tours &amp; day trips</p>
                <h2 id="services-h">Ways to explore</h2>
                <p className="lead">
                  Indicative starting prices — every trip is tailored to your
                  plans. Just ask and we&apos;ll suggest a route.
                </p>
              </div>
              <div className="cards">
                {services.map((s) => {
                  const img = resolveImageUrl(s.image, 800);
                  return (
                    <article className="card" key={s._id}>
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="card__img" src={img} alt={s.title} />
                      )}
                      <div className="card__body">
                        <h3>{s.title}</h3>
                        {s.description && (
                          <p className="card__desc">{s.description}</p>
                        )}
                        {typeof s.priceFrom === 'number' && (
                          <p className="price">
                            from {currencySymbol}
                            {s.priceFrom}{' '}
                            <small>{s.priceUnit || 'per day'}</small>
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Tour packages */}
        {showPackages && (
          <section
            className="section"
            id="packages"
            aria-labelledby="packages-h"
          >
            <div className="container">
              <div className="section-head">
                {tourPackages?.eyebrow && (
                  <p className="eyebrow">{tourPackages.eyebrow}</p>
                )}
                <h2 id="packages-h">
                  {tourPackages?.heading || 'Complete tour packages'}
                </h2>
                {tourPackages?.subheading && (
                  <p className="lead">{tourPackages.subheading}</p>
                )}
              </div>

              <div className="pkg-grid">
                {packagesList.map((p, i) => (
                  <article
                    className={`pkg-card${p.highlight ? ' pkg-card--featured' : ''}`}
                    key={p._key || `pkg-${i}`}
                  >
                    {p.highlight && (
                      <span className="pkg-card__badge">Best value</span>
                    )}
                    <h3 className="pkg-card__title">{p.title}</h3>
                    {p.forPeople && (
                      <p className="pkg-card__for">{p.forPeople}</p>
                    )}
                    <div className="pkg-card__prices">
                      {typeof p.originalPrice === 'number' && (
                        <span className="pkg-card__was">
                          {currencySymbol}
                          {p.originalPrice}
                        </span>
                      )}
                      <span className="pkg-card__now">
                        {currencySymbol}
                        {p.offerPrice}
                      </span>
                    </div>
                    {typeof p.originalPrice === 'number' &&
                      p.originalPrice > p.offerPrice && (
                        <p className="pkg-card__save">
                          Save {currencySymbol}
                          {p.originalPrice - p.offerPrice}
                        </p>
                      )}
                    {p.perDayNote && (
                      <p className="pkg-card__perday">{p.perDayNote}</p>
                    )}
                    <a
                      className="btn btn--primary pkg-card__cta"
                      href={bookHref}
                      target={
                        bookHref.startsWith('http') ? '_blank' : undefined
                      }
                      rel={
                        bookHref.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                    >
                      {tourPackages?.ctaLabel || 'Ask about a package'}
                    </a>
                  </article>
                ))}
              </div>

              {((tourPackages?.inclusions &&
                tourPackages.inclusions.length > 0) ||
                (tourPackages?.exclusions &&
                  tourPackages.exclusions.length > 0)) && (
                <div className="pkg-incl">
                  {tourPackages?.inclusions &&
                    tourPackages.inclusions.length > 0 && (
                      <div className="pkg-incl__col">
                        <p className="pkg-incl__title">Every package includes</p>
                        <ul className="pkg-incl__list pkg-incl__list--yes">
                          {tourPackages.inclusions.map((inc, i) => (
                            <li key={i}>{inc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {tourPackages?.exclusions &&
                    tourPackages.exclusions.length > 0 && (
                      <div className="pkg-incl__col">
                        <p className="pkg-incl__title pkg-incl__title--no">
                          Not included
                        </p>
                        <ul className="pkg-incl__list pkg-incl__list--no">
                          {tourPackages.exclusions.map((exc, i) => (
                            <li key={i}>{exc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              {tourPackages?.footnote && (
                <p className="pkg-footnote">{tourPackages.footnote}</p>
              )}

              {tourPackages?.showVehicleSection !== false && (
                <div
                  style={{
                    marginTop: 32,
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr)',
                    gap: 20,
                    alignItems: 'center',
                  }}
                  className="van-feature"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vehicleImage}
                    alt={
                      tourPackages?.vehicleImageAlt ||
                      "Inside Adhi's comfortable air-conditioned Toyota van, with cushioned seating and plenty of room for larger groups and families"
                    }
                    loading="lazy"
                    style={{
                      width: '100%',
                      borderRadius: 12,
                      display: 'block',
                    }}
                  />
                  <p className="lead" style={{ margin: 0 }}>
                    <strong>{vehicleHeading}</strong> {vehicleText}
                  </p>
                </div>
              )}

              {/* Internal links to full itinerary pages */}
              <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                <a className="btn btn--ghost" href="/itineraries">
                  See full itineraries
                </a>
                {' '}
                <a className="btn btn--ghost" href="/destinations">
                  Browse destinations
                </a>
              </p>
            </div>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="section" id="reviews" aria-labelledby="reviews-h">
            <div className="container">
              <div className="section-head">
                <p className="eyebrow">What guests say</p>
                <h2 id="reviews-h">Highly recommended</h2>
                <div className="rating-summary">
                  <span className="rating-summary__score">
                    {average.toFixed(1)}
                  </span>
                  <Stars value={average} />
                  <span className="lead" style={{ margin: 0 }}>
                    from {settings.reviewCount ?? count} review
                    {(settings.reviewCount ?? count) === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              {/* Story highlights — the moments that show "friend, not a tourist" */}
              <div className="review-highlights">
                {[
                  {
                    q: 'He even invited us to a real lunch with his family.',
                    a: 'Francesco',
                  },
                  {
                    q: 'Makes you feel at home and gives you a real perspective on the country.',
                    a: 'Miguel',
                  },
                  {
                    q: 'Calm and caring — he handled the daily planning so the trip was completely stress-free.',
                    a: 'Kristine',
                  },
                  {
                    q: 'The photo collage from our trip, given as we parted at the airport, was a fabulous surprise.',
                    a: 'Jane & Roger',
                  },
                  {
                    q: 'He knows the hidden gem places. Such a wonderful person.',
                    a: 'Abir',
                  },
                ].map((h) => (
                  <figure className="review-highlight" key={h.a}>
                    <blockquote>&ldquo;{h.q}&rdquo;</blockquote>
                    <figcaption>&mdash; {h.a}</figcaption>
                  </figure>
                ))}
              </div>

              <div className="review-grid">
                {reviews.map((r) => (
                  <blockquote className="review" key={r._id}>
                    <Stars value={r.ratingValue} />
                    {r.text && <p className="review__text">“{r.text}”</p>}
                    <p className="review__meta">
                      <span className="review__author">{r.author}</span>
                      {r.sourceName ? ` · via ${r.sourceName}` : ''}
                    </p>
                  </blockquote>
                ))}
              </div>
              {settings.reviewsUrl && (
                <p style={{ textAlign: 'center', marginTop: 32 }}>
                  <a
                    className="btn btn--ghost"
                    href={settings.reviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read all reviews
                  </a>
                </p>
              )}
            </div>
          </section>
        )}

        {/* Gallery */}
        {galleryPhotos.length > 0 && (
          <section
            className="section section--alt"
            id="gallery"
            aria-labelledby="gallery-h"
          >
            <div className="container">
              <div className="section-head">
                {gallery?.eyebrow && (
                  <p className="eyebrow">{gallery.eyebrow}</p>
                )}
                <h2 id="gallery-h">
                  {gallery?.heading || 'Travelling with Adhi'}
                </h2>
                {gallery?.subheading && (
                  <p className="lead">{gallery.subheading}</p>
                )}
              </div>
              <div className="gallery-grid">
                {galleryPhotos.map((p, i) => (
                  <figure className="gallery-item" key={p.key || i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="gallery-item__img"
                      src={p.url}
                      alt={p.caption || 'Photo from a tour with Adhi'}
                      loading="lazy"
                    />
                    {p.caption && (
                      <figcaption className="gallery-item__caption">
                        {p.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Destinations gallery */}
        {destinationsPhotos.length > 0 && (
          <section
            className="section"
            id="destinations"
            aria-labelledby="destinations-h"
          >
            <div className="container">
              <div className="section-head">
                {destinationsGallery?.eyebrow && (
                  <p className="eyebrow">{destinationsGallery.eyebrow}</p>
                )}
                <h2 id="destinations-h">
                  {destinationsGallery?.heading || 'Discover Sri Lanka'}
                </h2>
                {destinationsGallery?.subheading && (
                  <p className="lead">{destinationsGallery.subheading}</p>
                )}
              </div>
              <div className="gallery-grid">
                {destinationsPhotos.map((p, i) => (
                  <figure className="gallery-item" key={p.key || i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="gallery-item__img"
                      src={p.url}
                      alt={p.caption || 'A destination in Sri Lanka'}
                      loading="lazy"
                    />
                    {p.caption && (
                      <figcaption className="gallery-item__caption">
                        {p.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Watch / video section */}
        {hasVideos && (
          <section className="section section--alt" id="watch" aria-labelledby="watch-h">
            <div className="container">
              <div className="section-head">
                {videoSection?.eyebrow && (
                  <p className="eyebrow">{videoSection.eyebrow}</p>
                )}
                <h2 id="watch-h">
                  {videoSection?.heading || 'See Sri Lanka with Adhi'}
                </h2>
                {videoSection?.subheading && (
                  <p className="lead">{videoSection.subheading}</p>
                )}
              </div>
              <div
                className={
                  videoItems.length > 1 ? 'video-grid' : 'video-wrap'
                }
              >
                {videoItems.map((v) => (
                  <figure className="video-item" key={v.key}>
                    <video
                      className="video-player"
                      controls
                      preload="metadata"
                      playsInline
                      poster={v.poster || undefined}
                    >
                      <source src={v.url} type={v.mime} />
                      Your browser does not support embedded video.
                    </video>
                    {v.caption && (
                      <figcaption className="video-caption">
                        {v.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Activities & experiences we can arrange */}
        <section
          className="section"
          id="activities"
          aria-labelledby="activities-h"
        >
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Optional add-ons</p>
              <h2 id="activities-h">Activities and experiences we can arrange</h2>
              <p className="lead">
                Want to do more than sightseeing? Adhi can arrange your activities
                directly, through trusted local partners he knows personally — so
                everything is organised in one place, at the best local rates, and
                you travel with people he trusts.
              </p>
            </div>
            <div className="cards">
              {[
                {
                  t: 'Safari jeeps',
                  d: 'Yala, Udawalawe and other national parks, with experienced jeep drivers who know where the wildlife is and put safety first.',
                },
                {
                  t: 'Whale and dolphin watching',
                  d: 'Seasonal boat trips off the south coast (best roughly November to April).',
                },
                {
                  t: 'Madu River boat safari',
                  d: 'A peaceful mangrove cruise near Bentota, with islands, birdlife and a cinnamon stop.',
                },
                {
                  t: 'Village tours',
                  d: 'Bullock-cart rides, catamaran boats and a home-cooked Sri Lankan meal with a local family.',
                },
                {
                  t: 'And more on request',
                  d: "Tell Adhi what you're hoping to do and he'll arrange it.",
                },
              ].map((a) => (
                <article className="card" key={a.t}>
                  <div className="card__body">
                    <h3>{a.t}</h3>
                    <p className="card__desc">{a.d}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="lead" style={{ marginTop: 28 }}>
              Because Adhi works with reliable, experienced local partners, you can
              book everything through one trusted person and enjoy a safe,
              hassle-free trip. Just let him know what you&rsquo;d like when you plan
              your tour.
            </p>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section
            className="section section--alt"
            id="faq"
            aria-labelledby="faq-h"
          >
            <div className="container">
              <div className="section-head" style={{ margin: '0 auto 40px' }}>
                <p className="eyebrow">Good to know</p>
                <h2 id="faq-h">Frequently asked questions</h2>
              </div>
              <div className="faq">
                {faqs.map((f) => (
                  <details key={f._id}>
                    <summary>{f.question}</summary>
                    <div className="faq__answer">{f.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact / CTA */}
        <section className="section" id="contact" aria-labelledby="contact-h">
          <div className="container">
            <div className="contact">
              <h2 id="contact-h">Ready to plan your trip?</h2>
              <p>
                Tell us your dates and what you&apos;d like to see
                {settings.areaServed ? ` around ${settings.areaServed}` : ''}.
                We&apos;ll get back to you with a friendly, no-pressure plan.
              </p>
              <div className="contact__cta">
                <a
                  className="btn btn--primary"
                  style={{ background: '#fff', color: 'var(--brand)' }}
                  href={bookHref}
                  target={bookHref.startsWith('http') ? '_blank' : undefined}
                  rel={
                    bookHref.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                >
                  Plan your trip
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
              <div className="contact__links">
                {settings.contactEmail && (
                  <span>
                    Email:{' '}
                    <a href={`mailto:${settings.contactEmail}`}>
                      {settings.contactEmail}
                    </a>
                  </span>
                )}
                {settings.contactEmail && settings.contactPhone && ' · '}
                {settings.contactPhone && (
                  <span>Phone: {settings.contactPhone}</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span>
            © {new Date().getFullYear()} {settings.businessName}
            {settings.areaServed ? ` · ${settings.areaServed}` : ''}
          </span>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/itineraries">Itineraries</a>
            <a href="/destinations">Destinations</a>
            <a href="#contact">Contact</a>
            <a
              href="https://www.facebook.com/profile.php?id=61575833057687"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
