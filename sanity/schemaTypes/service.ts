import { defineField, defineType } from 'sanity';

/**
 * service — a thing you offer. For a driver-guide these are tours.
 * Ordered so the owner can drag to reorder in the Studio.
 */
export const service = defineType({
  name: 'service',
  title: 'Service / Tour',
  type: 'document',
  // Enables drag-to-reorder in the Studio document list.
  orderings: [
    {
      title: 'Display order',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'priceFrom',
      title: 'Price from',
      type: 'number',
      description: 'The starting price as a number, e.g. 80. Always shown as "from".',
    }),
    defineField({
      name: 'priceUnit',
      title: 'Price unit',
      type: 'string',
      description: 'What the price is per, e.g. "per day".',
      initialValue: 'per day',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
