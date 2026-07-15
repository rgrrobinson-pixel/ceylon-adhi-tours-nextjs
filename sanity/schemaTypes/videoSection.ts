import { defineField, defineType } from 'sanity';

/**
 * videoSection — a singleton "Watch" section with a self-hosted video file
 * uploaded directly into the studio (stored as a Sanity file asset), an
 * optional poster image (the still frame shown before play), and editable
 * heading text. The section stays hidden on the live site until a video is
 * uploaded, so nothing breaks while it is empty.
 */
export const videoSection = defineType({
  name: 'videoSection',
  title: 'Video (Watch) section',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Small label above the heading',
      type: 'string',
      description: 'A short tag shown above the heading, e.g. "Watch".',
      initialValue: 'Watch',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'The section title, e.g. "Travel Sri Lanka with us".',
      initialValue: 'See Sri Lanka with Adhi',
    }),
    defineField({
      name: 'subheading',
      title: 'Sub-heading',
      type: 'text',
      rows: 2,
      description: 'A short line under the heading (optional).',
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      description:
        'Add one or more videos (2-4 short clips works well). Each clip appears in a grid with its own player, poster image and caption.',
      of: [
        defineField({
          name: 'videoItem',
          title: 'Video',
          type: 'object',
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'A short caption shown under this clip, e.g. "Feeding Pooja at Millennium Orphanage".',
            }),
            defineField({
              name: 'video',
              title: 'Video file',
              type: 'file',
              description: 'Upload your video here (MP4 works best). Keep clips reasonably short for fast loading.',
              options: { accept: 'video/*' },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'poster',
              title: 'Poster image (optional)',
              type: 'image',
              options: { hotspot: true },
              description: 'A still image shown before this clip plays. If left empty, the video shows its own first frame.',
            }),
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'poster',
            },
            prepare: ({ title, media }) => ({
              title: title || 'Video',
              media,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'video',
      title: 'Video file (legacy single video)',
      type: 'file',
      options: { accept: 'video/*' },
    }),
  ],
});
