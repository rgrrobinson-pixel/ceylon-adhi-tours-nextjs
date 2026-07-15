import { defineField, defineType } from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Reviewer name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ratingValue',
      title: 'Rating (1-5)',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'text',
      title: 'Review text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'sourceName',
      title: 'Source',
      type: 'string',
      description: 'e.g. TripAdvisor or Google',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
  ],
  preview: {
    select: {
      title: 'author',
      subtitle: 'ratingValue',
    },
    prepare({ title, subtitle }) {
      return {
        title: title ?? 'Untitled review',
        subtitle: subtitle ? `${subtitle} / 5` : '',
      }
    },
  },
})
