import { defineField, defineType } from 'sanity';

/**
 * hero — the big intro section at the very top of the page.
 */
export const hero = defineType({
  name: 'hero',
  title: 'Hero section',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'The biggest line of text on the page.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Sub-headline',
      type: 'text',
      rows: 2,
      description: 'A supporting sentence under the headline.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Background image',
      type: 'image',
      description: 'A wide, high-quality photo. Landscape works best.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Button label',
      type: 'string',
      description: 'Text on the main button, e.g. "Plan your trip".',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'primaryCtaLink',
      title: 'Button link',
      type: 'string',
      description: 'Where the button goes. Use #contact to scroll to the contact section, or a full URL.',
      initialValue: '#contact',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Hero section' }),
  },
});
