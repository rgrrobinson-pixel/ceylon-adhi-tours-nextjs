import { defineField, defineType } from 'sanity';

/**
 * destinationsGallery — a second, general photo gallery (e.g. "Discover Sri Lanka").
 * Scenic destination shots rather than personal trip photos. Same editable
 * structure as the main gallery: heading + a list of photos with optional captions.
 */
export const destinationsGallery = defineType({
  name: 'destinationsGallery',
  title: 'Destinations gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Small label above the heading',
      type: 'string',
      description: 'A short tag shown above the heading, e.g. "Where Adhi takes you".',
      initialValue: 'Where Adhi takes you',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'The section title, e.g. "Discover Sri Lanka".',
      initialValue: 'Discover Sri Lanka',
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
      description: 'Add scenic destination photos here. Drag to reorder. Each photo can have a short caption.',
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
      title: title || 'Destinations gallery',
      subtitle: photos
        ? `${photos.length} photo${photos.length === 1 ? '' : 's'}`
        : 'No photos yet',
    }),
  },
});
