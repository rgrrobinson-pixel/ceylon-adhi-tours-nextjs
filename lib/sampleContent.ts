/**
 * Seed content for the Solo Launch standard template — Ceylon Adhi Tours.
 *
 * This is REAL, verified content from ceylonadhitours.com, used as the first
 * migration onto the standard self-editing template. It renders when no live
 * Sanity project is connected yet, so `npm run build` / `npm run dev` show the
 * true site out of the box. Once Roger connects Sanity, this is replaced by
 * the owner-edited content.
 *
 * HONESTY RULES baked in:
 *   - "highly recommended", never "licensed" (SLTDA licence pending).
 *   - Prices framed as "from US$X / day" (indicative, all-in).
 *   - No 100% guarantees anywhere.
 *
 * Image fields are plain string URLs (served from /public/sample).
 */
import type { SiteContent } from './types';

export const sampleContent: SiteContent = {
  settings: {
    businessName: 'Ceylon Adhi Tours',
    tagline: 'Private chauffeur driver-guide in Sri Lanka',
    logo: undefined,
    primaryColor: '#0E6E5C',
    contactEmail: 'hello@ceylonadhitours.com',
    contactPhone: '+94 76 123 4567',
    whatsappNumber: '94761234567',
    areaServed: 'Galle and southern Sri Lanka',
    currency: 'USD',
    bookingUrl: 'https://wa.me/94761234567',
  },
  hero: {
    headline:
      'Travel Sri Lanka with someone who treats you like a friend, not a tourist',
    subheadline:
      'Adhi is a local private driver-guide who builds your whole trip around you — the famous sights and the hidden places most visitors never see. Travellers leave feeling less like tourists and more like welcomed friends.',
    heroImage: '/sample/hero.jpg',
    primaryCtaLabel: 'Plan your trip',
    primaryCtaLink: '#contact',
  },
  about: {
    heading: 'Meet your guide',
    ownerName: 'Adhi',
    yearsExperience: undefined,
    portrait: undefined,
    body: [
      'Ayubowan, and a very warm welcome. I\u2019m Adhi \u2014 your private driver and guide here in Sri Lanka. For years I\u2019ve shown travellers our ancient cities, misty tea hills, wildlife parks and beautiful southern beaches.',
      'When you travel with me, you\u2019re not just booking a driver. You get a friend who looks after every detail and builds the trip around exactly what you want to see.',
      'Send me a message any time on WhatsApp \u2014 I can\u2019t wait to meet you.',
    ],
  },
  services: [
    {
      _id: 'tour-highlights',
      title: 'Highlights of Sri Lanka',
      description:
        'A 7-day private tour taking in the essential sights \u2014 Sigiriya, the southern beaches and Galle \u2014 at a relaxed pace, with everything arranged for you.',
      priceFrom: 80,
      priceUnit: 'per day',
      image: '/sample/tour-galle.jpg',
      order: 1,
    },
    {
      _id: 'tour-complete',
      title: 'The complete island',
      description:
        'Our most popular 10-day tour: ancient cities, the hill country and tea estates around Ella, Yala wildlife and the south coast. A full taste of the whole island.',
      priceFrom: 80,
      priceUnit: 'per day',
      image: '/sample/tour-tea.jpg',
      order: 2,
    },
    {
      _id: 'tour-indepth',
      title: 'Sri Lanka in depth',
      description:
        'A 14-day journey for travellers who want to see it all \u2014 unhurried days, hidden corners and time to enjoy each place properly. Built entirely around your interests.',
      priceFrom: 80,
      priceUnit: 'per day',
      image: '/sample/tour-safari.jpg',
      order: 3,
    },
  ],
  faqs: [
    {
      _id: 'faq-safe',
      question: 'Is Sri Lanka safe to visit?',
      answer:
        'Yes. Sri Lanka is a warm, welcoming country and travellers are made to feel at home. Travelling with a private driver-guide means you always have someone local looking after the details and making sure you feel comfortable from start to finish.',
      order: 1,
    },
    {
      _id: 'faq-visa',
      question: 'Do I need a visa?',
      answer:
        'Since May 2026, citizens of 40 countries can enter Sri Lanka visa-free with a free 30-day ETA (Electronic Travel Authorisation). I\u2019m happy to point you to the official details for your country when you\u2019re planning.',
      order: 2,
    },
    {
      _id: 'faq-cost',
      question: 'How much does a tour cost?',
      answer:
        'Tours start from around US$80 per day. That\u2019s an indicative all-in rate covering a comfortable air-conditioned vehicle, fuel and my time as your driver and guide. I\u2019ll always give you a clear price before we set off \u2014 no surprises.',
      order: 3,
    },
    {
      _id: 'faq-custom',
      question: 'Can you plan a custom itinerary?',
      answer:
        'Absolutely. Tell me how many days you have and what interests you, and I\u2019ll suggest a route. We can adjust the plan as we go \u2014 the trip is built around you.',
      order: 4,
    },
    {
      _id: 'faq-family',
      question: 'Is this suitable for families?',
      answer:
        'Yes \u2014 families are very welcome. I\u2019m patient with changing plans, careful on the roads, and happy to suggest things children will enjoy along the way.',
      order: 5,
    },
  ],
  reviews: [
    {
      _id: 'review-diana',
      author: 'Diana Howard',
      ratingValue: 5,
      text: 'Just had a great three-week trip. A comfortable Mercedes van that fit five adults. Always punctual and a safe driver. Happy and cheerful, often suggesting extra things to see.',
      sourceName: 'TripAdvisor',
      date: '2026-01-15',
    },
    {
      _id: 'review-rajnarang',
      author: 'rajnarang',
      ratingValue: 5,
      text: 'An English-speaking driver who is very professional, knowledgeable and safe. We felt we were in safe hands from beginning to end. I would highly recommend Adhi.',
      sourceName: 'TripAdvisor',
      date: '2026-04-20',
    },
  ],
  gallery: null,
  destinationsGallery: null,
  videoSection: null,
  tourPackages: {
    // Disabled: these are demo packages with fixed sample prices. Adhi's real
    // tours are the 7/14/15-day itinerary pages with indicative "from US$80/day"
    // pricing only. Keeping this off avoids showing fixed quotes Adhi never set.
    enabled: false,
    eyebrow: 'Best-value packages',
    heading: 'Complete tour packages',
    subheading:
      'Prefer to see the whole trip cost up front? Choose a ready-made package below — or build a custom tour on the daily rate. Either way, every trip is private and tailored to you.',
    packages: [
      {
        _key: 'pkg-4',
        title: '4-Day Tour',
        forPeople: 'for 2 people',
        originalPrice: 380,
        offerPrice: 330,
        perDayNote: 'around US$83 per day',
      },
      {
        _key: 'pkg-7',
        title: '7-Day Tour',
        forPeople: 'for 2 people',
        originalPrice: 570,
        offerPrice: 520,
        perDayNote: 'around US$75 per day',
        highlight: true,
      },
      {
        _key: 'pkg-10',
        title: '10-Day Tour',
        forPeople: 'for 2 people',
        originalPrice: 750,
        offerPrice: 680,
        perDayNote: 'around US$68 per day',
      },
      {
        _key: 'pkg-14',
        title: '14-Day Tour',
        forPeople: 'for 2 people',
        originalPrice: 1000,
        offerPrice: 920,
        perDayNote: 'around US$66 per day',
      },
    ],
    inclusions: [
      'Air-conditioned car and your private driver-guide for the whole trip',
      'Fuel and all driver costs',
      'Driver’s accommodation and meals',
    ],
    exclusions: [
      'Your own accommodation (hotels / guesthouses)',
      'Entrance fees to parks and sites',
      'Meals and personal expenses',
    ],
    footnote:
      'Prices are in US dollars for the tour as described and are indicative. They include the car, driver-guide, fuel, and the driver’s accommodation and meals. Your own accommodation, entrance fees and personal expenses are not included. Longer tours have lower daily rates — larger groups and different vehicles can be arranged on request.',
    ctaLabel: 'Ask about a package',
  },
};
