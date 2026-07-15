import { defineField, defineType } from 'sanity';

/**
 * gallery — the photo gallery section (e.g. "Travelling with Adhi").
 * A single editable section with a heading and a list of photos, each with
 * an optional caption. Owners can add, remove, reorder and re-caption photos
 * directly in the Studio.
 */
export const gallery = defineType({
  name: 'gallery',
  title: 'Photo gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Small label above the heading',
      type: 'string',
      description: 'A short tag shown above the heading, e.g. "Real travellers".',
      initialValue: 'Real travellers',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'The section title, e.g. "Travelling with Adhi".',
      initialValue: 'Travelling with Adhi',
    }),
    defineField({
      name: 'subheading',
      title: 'Sub-heading',
      type: 'text',
      rows: 2,
      description: 'A short line under the heading.',
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      description: 'Add your trip photos here. Drag to reorder. Each photo can have a short caption.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'A short caption shown under the photo (optional).',
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', photos: 'photos' },
    prepare: ({ title, photos }) => ({
      title: title || 'Photo gallery',
      subtitle: photos
        ? `${photos.length} photo${photos.length === 1 ? '' : 's'}`
        : 'No photos yet',
    }),
  },
});
