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
    defineField({
      name: 'showVehicleSection',
      title: 'Show larger group / van section',
      type: 'boolean',
      description: 'Turn the vehicle/van section below the packages on or off.',
      initialValue: true,
    }),
    defineField({
      name: 'vehicleHeading',
      title: 'Vehicle section heading',
      type: 'string',
      initialValue: 'Travelling as a larger group or family?',
    }),
    defineField({
      name: 'vehicleText',
      title: 'Vehicle section text',
      type: 'text',
      rows: 4,
      initialValue:
        "For couples and small groups of up to about 3 people, Adhi's comfortable air-conditioned car is ideal. For bigger groups and families, his air-conditioned Toyota van has plenty of room, plus luggage, so everyone travels together — indicative van rate from around US$90 per day. Just tell him your group size and he'll arrange the right vehicle.",
    }),
    defineField({
      name: 'vehicleImage',
      title: 'Vehicle / van image',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo shown with the larger group / van section.',
    }),
    defineField({
      name: 'vehicleImageAlt',
      title: 'Vehicle image description',
      type: 'string',
      description:
        'Describe the image for accessibility and Google, e.g. "Inside Adhi’s air-conditioned Toyota van".',
    }),
  ],
});
