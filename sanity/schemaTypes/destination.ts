import { defineField, defineType } from 'sanity';

/**
 * destination — a Sri Lanka destination / region document.
 * Each document becomes a page at /destinations/[slug].
 */
export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Destination name',
      type: 'string',
      description: 'E.g. "Sigiriya and the Cultural Triangle". Shown as the page heading.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description: 'The URL path, e.g. cultural-triangle-sigiriya.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      description: 'Short region label shown on cards, e.g. "North Central Province".',
    }),
    defineField({
      name: 'summary',
      title: 'Summary / intro',
      type: 'text',
      rows: 4,
      description: 'A short paragraph introducing this destination. Used in link previews.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      description: 'Main image for this destination.',
    }),
  ],
});
