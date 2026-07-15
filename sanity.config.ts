'use client'

/**
 * Sanity Studio configuration. This config powers the embedded Studio that
 * is mounted at /studio in the Next.js app.
 *
 * Note: even when no real project ID is configured, this must still produce a
 * valid config object so the route can compile. We use a safe placeholder ID.
 */
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'

import { apiVersion, dataset, projectId, isSanityConfigured } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId: isSanityConfigured ? projectId : 'placeholder',
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    // Media library: adds a browsable image library + makes the "Select"
    // button on image fields open a searchable grid of all uploaded photos.
    media(),
    // Vision lets advanced users test GROQ queries. Safe to keep.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
