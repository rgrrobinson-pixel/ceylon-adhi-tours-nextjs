/**
 * Embedded Sanity Studio, mounted at /studio.
 *
 * The owner edits all their website content here at theirsite.com/studio —
 * there is no separate app to install or run.
 */
import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
