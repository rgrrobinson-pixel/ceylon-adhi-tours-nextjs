import { resolveImageUrl } from '@/lib/resolveImage';
import type { LandingPage, SiteContent } from '@/lib/types';
import { SiteChrome } from './SiteChrome';

function whatsappHref(num: string | undefined, message: string) {
  if (!num) return null;
  const digits = num.replace(/[^0-9]/g, '');
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : null;
}

export function LandingPageView({
  landingPage,
  content,
}: {
  landingPage: LandingPage;
  content: SiteContent;
}) {
  const { settings } = content;
  const heroImg = landingPage.heroImage
    ? resolveImageUrl(landingPage.heroImage, 1800)
    : null;
  const waHref = whatsappHref(
    settings.whatsappNumber,
    landingPage.whatsappMessage ||
      `Hi Adhi, I'm interested in ${landingPage.title}.`,
  );

  const faqSchema =
    landingPage.faqs && landingPage.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: landingPage.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <SiteChrome content={content}>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section className={heroImg ? 'hero' : 'section section--hero'} aria-label={landingPage.title}>
        {heroImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero__img" src={heroImg} alt="" aria-hidden="true" />
        )}
        {heroImg && <div className="hero__scrim" aria-hidden="true" />}
        <div className={heroImg ? 'container hero__content' : 'container'}>
          <p className="eyebrow">
            {landingPage.eyebrow || landingPage.category || 'Sri Lanka tours'}
          </p>
          <h1>{landingPage.title}</h1>
          <p className={heroImg ? 'hero__sub' : 'lead'}>{landingPage.summary}</p>
          {waHref && (
            <div className="hero__cta">
              <a
                className="btn btn--whatsapp"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {landingPage.ctaLabel || 'Plan this trip on WhatsApp'}
              </a>
            </div>
          )}
        </div>
      </section>

      {landingPage.sections?.map((section, index) => (
        <section
          key={section._key || `${section.heading}-${index}`}
          className={`section${index % 2 === 1 ? ' section--alt' : ''}`}
        >
          <div className="container" style={{ maxWidth: '820px' }}>
            {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
            <h2>{section.heading}</h2>
            {section.body && (
              <p className="lead" style={{ whiteSpace: 'pre-line' }}>
                {section.body}
              </p>
            )}
            {section.points && section.points.length > 0 && (
              <ul className="feature-list">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      {landingPage.faqs && landingPage.faqs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Common questions</p>
              <h2>{landingPage.title} FAQs</h2>
            </div>
            <dl className="faq-list">
              {landingPage.faqs.map((faq, index) => (
                <div key={faq._key || index} className="faq-list__item">
                  <dt>{faq.question}</dt>
                  <dd>{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="section section--cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to plan your Sri Lanka trip?</h2>
          <p className="lead">
            Message Adhi on WhatsApp and he will help tailor the route,
            vehicle and pace around your group.
          </p>
          {waHref && (
            <a
              className="btn btn--whatsapp"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {landingPage.ctaLabel || 'WhatsApp Adhi'}
            </a>
          )}
        </div>
      </section>

      <section className="section section--alt" aria-label="Related links">
        <div
          className="container"
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {(landingPage.relatedLinks && landingPage.relatedLinks.length > 0
            ? landingPage.relatedLinks
            : [
                { label: 'View all itineraries', href: '/itineraries' },
                { label: 'All destinations', href: '/destinations' },
                { label: 'FAQ', href: '/#faq' },
                { label: 'Home', href: '/' },
              ]
          ).map((link) => (
            <a className="btn btn--ghost" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
