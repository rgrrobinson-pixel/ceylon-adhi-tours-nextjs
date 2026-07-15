import { defineField, defineType } from 'sanity';

/**
 * itinerary — a multi-day private tour document.
 * Each document becomes a page at /itineraries/[slug].
 * Adhi edits these in Studio; fields are plain-English labelled.
 */
export const itinerary = defineType({
  name: 'itinerary',
  title: 'Itinerary',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tour title',
      type: 'string',
      description: 'E.g. "7-Day Private Sri Lanka Tour". Shown as the page heading.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description: 'The URL path for this tour, e.g. 7-day-private-sri-lanka-tour.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary / intro',
      type: 'text',
      rows: 4,
      description: 'A short paragraph introducing this tour. Shown under the heading and in link previews.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      description: 'Main image for this tour. Used as the page banner and social preview.',
    }),
    defineField({
      name: 'durationDays',
      title: 'Duration (days)',
      type: 'number',
      description: 'How many days this tour spans, e.g. 7 or 14.',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'bestFor',
      title: 'Best for',
      type: 'string',
      description: 'Who this tour suits, e.g. "First-time visitors wanting a highlights circuit".',
    }),
    defineField({
      name: 'days',
      title: 'Day-by-day itinerary',
      type: 'array',
      description: 'Add one entry per day. Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'itineraryDay',
          title: 'Day',
          fields: [
            defineField({
              name: 'dayNumber',
              title: 'Day number',
              type: 'number',
              validation: (r) => r.required().min(1),
            }),
            defineField({
              name: 'title',
              title: 'Day title',
              type: 'string',
              description: 'E.g. "Arrival in Colombo — Galle Fort"',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'body',
              title: 'Description',
              type: 'text',
              rows: 4,
              description: 'What happens on this day.',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { dayNumber: 'dayNumber', title: 'title' },
            prepare({ dayNumber, title }: { dayNumber?: number; title?: string }) {
              return { title: `Day ${dayNumber ?? '?'}: ${title ?? ''}` };
            },
          },
        }
      ],
    }),
    defineField({
      name: 'inclusions',
      title: 'What is included',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List each item included in the price, e.g. "Private air-conditioned vehicle".',
    }),
    defineField({
      name: 'exclusions',
      title: 'What is not included',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List items the guest pays separately, e.g. "International flights".',
    }),
    defineField({
      name: 'priceNote',
      title: 'Indicative price note',
      type: 'string',
      description: 'E.g. "Indicative pricing from US$80 per day — contact us for a tailored quote." Do not write a fixed price.',
    }),
    defineField({
      name: 'faqs',
      title: 'Frequently asked questions',
      type: 'array',
      description: 'Specific traveller questions and clear answers about this tour, e.g. "Is accommodation included?" or "Can this tour be customised?". Shown as a FAQ section and used for structured data. Aim for 3-5 genuine questions.',
      of: [
        {
          type: 'object',
          name: 'faqItem',
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
              description: 'A direct, factual answer in the first sentence, then any detail.',
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
      name: 'seoTitle',
      title: 'SEO page title (optional)',
      type: 'string',
      description: 'If left blank the tour title is used. Keep under 60 characters.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO meta description (optional)',
      type: 'text',
      rows: 2,
      description: 'If left blank the summary is used. Keep under 155 characters.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'durationDays' },
    prepare({ title, subtitle }: { title?: string; subtitle?: number }) {
      return {
        title: title ?? 'Untitled itinerary',
        subtitle: subtitle ? `${subtitle} days` : '',
      };
    },
  },
});
