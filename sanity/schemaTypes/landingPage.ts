import { defineField, defineType } from 'sanity';

/**
 * landingPage — reusable SEO landing pages such as family tours, group tours,
 * private driver pages, van hire pages, airport transfer pages, etc.
 * Each published document can appear at /[slug].
 */
export const landingPage = defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      description: 'Shown as the main page heading.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description: 'The page URL, e.g. family-tours-sri-lanka.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Page category',
      type: 'string',
      description: 'Internal label, e.g. Family, Group, Van, Private Driver.',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Small heading above title',
      type: 'string',
      description: 'E.g. Private family travel.',
    }),
    defineField({
      name: 'summary',
      title: 'Intro / summary',
      type: 'text',
      rows: 4,
      description: 'Short introduction shown under the heading and in previews.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional main image for the page and social preview.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Main button label',
      type: 'string',
      description: 'E.g. Plan this trip on WhatsApp.',
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'WhatsApp message',
      type: 'string',
      description: 'Pre-filled WhatsApp message for this page.',
    }),
    defineField({
      name: 'sections',
      title: 'Content sections',
      type: 'array',
      description: 'Add flexible content blocks for the page.',
      of: [
        {
          type: 'object',
          name: 'landingPageSection',
          title: 'Section',
          fields: [
            defineField({
              name: 'eyebrow',
              title: 'Small heading',
              type: 'string',
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body text',
              type: 'text',
              rows: 5,
            }),
            defineField({
              name: 'points',
              title: 'Bullet points',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
          preview: {
            select: { title: 'heading', subtitle: 'eyebrow' },
          },
        },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'Frequently asked questions',
      type: 'array',
      description: 'Shown on the page and used for FAQ structured data.',
      of: [
        {
          type: 'object',
          name: 'landingPageFaq',
          title: 'Question',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    }),
    defineField({
      name: 'relatedLinks',
      title: 'Related links',
      type: 'array',
      description: 'Optional links to other useful pages.',
      of: [
        {
          type: 'object',
          name: 'landingPageLink',
          title: 'Link',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              description: 'Use /itineraries, /destinations, /family-tours-sri-lanka, etc.',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO page title',
      type: 'string',
      description: 'Optional. Keep under 60 characters if possible.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO meta description',
      type: 'text',
      rows: 2,
      description: 'Optional. Keep under 155 characters if possible.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: title || 'Untitled landing page',
        subtitle: subtitle ? `/${subtitle}` : '',
      };
    },
  },
});
