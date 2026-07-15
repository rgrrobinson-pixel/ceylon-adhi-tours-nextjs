import { defineField, defineType } from 'sanity';

/**
 * about — your story / who you are.
 */
export const about = defineType({
  name: 'about',
  title: 'About section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'About',
    }),
    defineField({
      name: 'ownerName',
      title: 'Your name',
      type: 'string',
      description: 'The name of the person running the business.',
    }),
    defineField({
      name: 'yearsExperience',
      title: 'Years of experience',
      type: 'number',
      description: 'How many years you have been doing this.',
    }),
    defineField({
      name: 'portrait',
      title: 'Photo of you',
      type: 'image',
      description: 'A friendly portrait builds trust.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'body',
      title: 'Your story',
      type: 'array',
      description: 'A few short paragraphs about you and what you offer.',
      of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }] }],
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'ownerName' },
  },
});
