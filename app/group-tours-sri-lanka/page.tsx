import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/getContent';
import { getAllItineraries } from '@/lib/getPages';
import { SiteChrome } from '@/components/SiteChrome';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceylonadhitours.com';

const PAGE_PATH = '/group-tours-sri-lanka';
const PAGE_TITLE = 'Group & Larger-Party Tours of Sri Lanka by Private Van | Ceylon Adhi Tours';
const PAGE_DESCRIPTION =
  'Travelling Sri Lanka as a group? Adhi is a trusted local driver-guide with a comfortable air-conditioned Toyota van — ideal for friends, extended families and small groups who want to travel together. Plan your trip on WhatsApp.';

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSiteContent();
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
        url: `${SITE_URL}/adhi-van-exterior.jpg`,
        width: 1200,
        alt: 'Adhi’s air-conditioned Toyota van for group tours of Sri Lanka'
      }],
    },
  };
}

// FAQ items reused for both the on-page accordion and FAQ schema.
const FAQS = [
  {
    question: 'How many people can travel in the van?',
    answer:
      'Adhi’s air-conditioned Toyota van comfortably carries a group with room to spare, plus space for everyone’s luggage — so friends, extended families and small groups all travel together rather than splitting across taxis. Tell Adhi your exact group size and he’ll confirm the right vehicle for you.',
  },
  {
    question: 'Is it cheaper to travel as a group with a private driver?',
    answer:
      'Often, yes. The driver-guide rate is for the vehicle, not per person, so the more of you travelling together, the more you each save compared with separate transport or organised group coaches — while still getting a private, flexible trip.',
  },
  {
    question: 'What does a group tour cost?',
    answer:
      'The indicative driver-guide rate is from around US$90 per day for the Toyota van — for the vehicle, not per person. Exact pricing is confirmed by Adhi for your specific trip. Hotels, meals and site entry tickets are usually separate, so your group stays in control of its budget.',
  },
];

export default async function GroupToursPage() {
  const [{ content }, itineraries] = await Promise.all([
    getSiteContent(),
    getAllItineraries(),
  ]);

  const { settings } = content;

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Adhi, I’d like to plan a group tour of Sri Lanka.')}`
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
          <p className="eyebrow">Private group travel</p>
          <h1>Group Tours of Sri Lanka</h1>
          <p className="lead">
            Travel Sri Lanka together in Adhi’s comfortable Toyota van. No splitting into taxis,
            no fixed coach schedules — just your group exploring at your own pace.
          </p>
          {waHref && (
            <a
              className="btn btn--whatsapp"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Plan your group trip on WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* Why choose a private group tour */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Why travel with us</p>
            <h2>The smarter way to travel as a group</h2>
            <p className="lead">
              One vehicle, one trusted guide, and the freedom to design the trip around your group.
            </p>
          </div>
          <ul className="feature-list">
            <li><strong>Stay together</strong> — no splitting across multiple taxis or coaches</li>
            <li><strong>Better value</strong> — one vehicle rate shared across the group</li>
            <li><strong>Your schedule</strong> — depart when you want, stop where you like</li>
            <li><strong>Spacious Toyota van</strong> — comfortable for groups of 4–8 people with luggage</li>
            <li><strong>One trusted guide</strong> — Adhi stays with your group for the entire trip</li>
          </ul>
        </div>
      </section>

      {/* Related itineraries */}
      {itineraries.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Suggested routes</p>
              <h2>Group-friendly itineraries</h2>
              <p className="lead">Every itinerary is fully customisable for groups of any size.</p>
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
            <h2>Group tour FAQs</h2>
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
          <h2>Ready to plan your group adventure?</h2>
          <p className="lead">
            Message Adhi on WhatsApp to start planning your group tour of Sri Lanka.
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
          <a className="btn btn--ghost" href="/family-tours-sri-lanka">
            Family tours
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
