import imageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';

import { dataset, projectId, isSanityConfigured } from '../env';

const builder = imageUrlBuilder({
  projectId: isSanityConfigured ? projectId : 'placeholder',
  dataset,
});

/**
 * Build a URL for a Sanity image reference. Returns null when no usable
 * image is supplied (e.g. fallback sample content uses plain string URLs,
 * handled separately by the components).
 */
export function urlForImage(source: Image | undefined | null) {
  if (!source || !(source as Image).asset) {
    return null;
  }
  return builder.image(source as Image).auto('format').fit('max');
}
