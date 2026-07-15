/**
 * Central place that reads Sanity environment variables.
 *
 * The whole template is designed to work WITHOUT real Sanity credentials.
 * If the project ID is missing or still set to the placeholder value, we
 * treat the project as "not configured yet" and the data layer falls back
 * to bundled sample content. This keeps `npm run build` and `npm run dev`
 * working out of the box.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id';

export const readToken = process.env.SANITY_API_READ_TOKEN || '';

// Sanity project IDs may only contain a-z, 0-9 and dashes. The placeholder
// "your-project-id" is technically a valid-looking string, so we explicitly
// treat it (and empty values) as "not configured".
const PLACEHOLDER_IDS = new Set(['', 'your-project-id', 'undefined']);

/**
 * True only when a real-looking Sanity project ID has been supplied.
 * When false, the data layer uses bundled sample content.
 */
export const isSanityConfigured: boolean = !PLACEHOLDER_IDS.has(
  (projectId || '').trim()
);
