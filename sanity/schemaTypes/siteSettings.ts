import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'businessName',
      title: 'Business name',
      type: 'string',
      description: 'Your business name. Shown in the header, footer and page title.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'A short phrase under your name, e.g. "Private driver-guide in southern Sri Lanka".',
    }),
    defineField({
      name: 'logo',
      title: 'Logo (optional)',
      type: 'image',
      description: 'Optional. If left empty, your business name is shown as text.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'theme',
      title: 'Website style',
      type: 'string',
      description: 'Choose the overall look and feel of your site.',
      options: {
        list: [
          { title: 'Classic & Warm', value: 'classic' },
          { title: 'Bold & Modern', value: 'bold' },
          { title: 'Minimal & Editorial', value: 'minimal' },
        ],
      },
    }),
  ],
});
