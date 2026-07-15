import { defineField, defineType } from 'sanity';

/**
 * tourPackagesSection — a singleton holding the "Tour packages" section:
 * an intro plus a list of fixed-price package deals. Each package shows an
 * original price struck through and a highlighted package price, so guests
 * can see the whole-trip cost at a glance.
 */
export const tourPackagesSection = defineType({
  name: 'tourPackagesSection',
  title: 'Tour packages section',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show this section on the website',
      type: 'boolean',
      description: 'Turn the whole packages section on or off.',
      initialValue: true,
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (small label above the heading)',
      type: 'string',
      initialValue: 'Best-value packages',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Complete tour packages',
    }),
    defineField({
      name: 'subheading',
      title: 'intro text',
      type: 'text',
      rows: 3,
      initialValue:
        'Prefer to see the whole trip cost up front? Choose a ready-made package below — or build a custom tour on the daily rate. Either way, every trip is private and tailored to you.',
    }),
    defineField({
      name: 'packages',
      title: 'Packages',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tourPackage',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'e.g. "7-Day Tour".',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'forPeople',
              title: 'For how many people',
              type: 'string',
              description: 'e.g. "for 2 people".',
            }),
            defineField({
              name: 'originalPrice',
              title: 'Original price (number only)',
              type: 'number',
              description: 'Shown struck through. e.g. 570.',
            }),
            defineField({
              name: 'offerPrice',
              title: 'Package price (number only)',
              type: 'number',
              description: 'The highlighted price, e.g. 520.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'perDayNote',
              title: 'Per-day note (optional)',
              type: 'string',
              description: 'e.g. "works out at US$75 per day".',
            }),
            defineField({
              name: 'highlight',
              title: 'Mark as "Best value"',
              type: 'boolean',
              description: 'Adds a small highlight badge to this package.',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              forPeople: 'forPeople',
              offerPrice: 'offerPrice',
            },
            prepare: ({ title, forPeople, offerPrice }) => ({
              title: [title, forPeople].filter(Boolean).join(' · '),
              subtitle: offerPrice ? `US$${offerPrice}` : undefined,
            }),
          },
        },
      ],
    }),
  ],
});
