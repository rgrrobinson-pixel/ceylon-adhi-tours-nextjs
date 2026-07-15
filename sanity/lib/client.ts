import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, isSanityConfigured } from '../env';

/**
 * A Sanity client. When Sanity is not yet configured we still create a
 * client (so imports don't crash), but the data layer in `sanity/lib/fetch.ts`
 * never actually calls it — it returns bundled sample content instead.
 *
 * We use a safe project ID so createClient never throws on a malformed value.
 */
export const client = createClient({
  projectId: isSanityConfigured ? projectId : 'placeholder',
  dataset,
  apiVersion,
  // Read live (no CDN cache) so content published in Studio is reflected
  // immediately when the page is rendered on each request.
  useCdn: false,
  perspective: 'published',
});
