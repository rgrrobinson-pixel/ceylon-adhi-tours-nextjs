import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/getContent';
import { getAllItineraries, getLandingPageBySlug } from '@/lib/getPages';
import { resolveImageUrl } from '@/lib/resolveImage';
import { SiteChrome } from '@/components/SiteChrome';
import { LandingPageView } from '@/components/LandingPageView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceylonadhitours.com';

const PAGE_PATH = '/family-tours-sri-lanka';
const PAGE_TITLE = 'Family Tours of Sri Lanka with a Private Driver-Guide | Ceylon Adhi Tours';
const PAGE_DESCRIPTION =
  'Travel Sri Lanka as a family with Adhi — a trusted local driver-guide. Safe, relaxed, child-friendly private tours in a comfortable air-conditioned car or Toyota van. Plan your trip on WhatsApp.';

export async function generateMetadata(): Promise<Metadata> {
  const landingPage = await getLandingPageBySlug(PAGE_PATH.slice(1));
  const { content } = await getSiteContent();
  if (landingPage) {
    const title =
      landingPage.seoTitle ||
      `${landingPage.title} — ${content.settings.businessName}`;
    const description = landingPage.seoDescription || landingPage.summary;
    const ogImage = landingPage.heroImage
      ? resolveImageUrl(landingPage.heroImage, 1200)
      : null;
    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      alternates: { canonical: PAGE_PATH },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}${PAGE_PATH}`,
        siteName: content.settings.businessName,
        images: ogImage
          ? [{ url: ogImage, width: 1200, alt: landingPage.title }]
          : undefined,
      },
    };
  }
  return {
    metadataBase: new URL(SITE_URL),
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: { canonical: PAGE_PATH },
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: `${SITE_URL}${PAGE_PATH}`,
      siteName: content.settings.businessName,
      images: [{
        url: `${SITE_URL}/adhi-van-interior.jpg`,
        width: 1200,
        alt: 'Inside Adhi’s air-conditioned Toyota van'
      }],
    },
  };
}

// FAQ items reused for both the on-page accordion and FAQ schema.
const FAQS = [
  {
    question: 'Is travelling with a private driver-guide good for families with kids?',
    answer:
      'Yes. You have one trusted local with you for the whole trip, the pace is built around your children, and there are no language barriers or changing drivers. Adhi breaks up long drives with stops for a swim, a snack or a rest, and the plan flexes if the little ones need a quieter day.',
  },
  {
    question: 'How many people fit in the vehicle?',
    answer:
      'For couples and small families of up to about 3 people, Adhi’s comfortable air-conditioned car works well. Families of 4–8 people can book the Toyota van. Both vehicles have plenty of luggage space.',
  },
  {
    question: 'What does a family tour cost?',
    answer:
      'The indicative driver-guide rate is from around US$80 per day (car) or from around US$90 per day (Toyota van), for the vehicle — not per person. Exact pricing is confirmed by Adhi for your specific trip. Hotels, meals and site entry tickets are usually separate, so you stay in control of your budget.',
  },
];

export default async function FamilyToursPage() {
  const [landingPage, { content }, itineraries] = await Promise.all([
    getLandingPageBySlug(PAGE_PATH.slice(1)),
    getSiteContent(),
    getAllItineraries(),
  ]);

  if (landingPage) {
    return <LandingPageView landingPage={landingPage} content={content} />;
  }

  const { settings } = content;

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Adhi, I’d like to plan a family tour of Sri Lanka.')}`
    : null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <SiteChrome content={content}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="section section--hero">
        <div className="container">
          <p className="eyebrow">Private family travel</p>
          <h1>Family Tours of Sri Lanka</h1>
          <p className="lead">
            Explore Sri Lanka at your family’s own pace with Adhi as your private driver-guide.
            Safe, relaxed, and fully customisable — from beach days to ancient temples.
          </p>
          {waHref && (
            <a
              className="btn btn--whatsapp"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Plan your family trip on WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* Why choose a private tour */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Why travel with us</p>
            <h2>Built around your family</h2>
            <p className="lead">
              No shared coaches, no fixed group schedules. Just your family and a trusted local guide.
            </p>
          </div>
          <ul className="feature-list">
            <li><strong>Flexible pace</strong> — rest days, early starts, or late check-outs as needed</li>
            <li><strong>Child-friendly stops</strong> — elephant sanctuaries, beaches, train rides, and more</li>
            <li><strong>Comfortable vehicles</strong> — air-conditioned car for small families or Toyota van for larger groups</li>
            <li><strong>One trusted guide</strong> — Adhi stays with your family for the entire trip</li>
            <li><strong>WhatsApp planning</strong> — easy communication before and during your trip</li>
          </ul>
        </div>
      </section>

      {/* Related itineraries */}
      {itineraries.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Suggested routes</p>
              <h2>Family-friendly itineraries</h2>
              <p className="lead">These itineraries work especially well for families. Every route is fully customisable.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <a className="btn" href="/itineraries">
                View all itineraries
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Common questions</p>
            <h2>Family tour FAQs</h2>
          </div>
          <dl className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-list__item">
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to plan your family adventure?</h2>
          <p className="lead">
            Message Adhi on WhatsApp to start designing your perfect family tour of Sri Lanka.
          </p>
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
      </section>

      {/* Internal links */}
      <section className="section section--alt" aria-label="Related links">
        <div
          className="container"
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a className="btn btn--ghost" href="/group-tours-sri-lanka">
            Group tours
          </a>
          {itineraries.length > 0 && (
            <a className="btn btn--ghost" href="/itineraries">
              View all itineraries
            </a>
          )}
          <a className="btn btn--ghost" href="/destinations">
            All destinations
          </a>
          <a className="btn btn--ghost" href="/#faq">
            FAQ
          </a>
          <a className="btn btn--ghost" href="/">
            Home
          </a>
        </div>
      </section>
    </SiteChrome>
  );
}
