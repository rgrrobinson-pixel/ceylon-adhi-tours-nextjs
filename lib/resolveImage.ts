import { urlForImage } from '@/sanity/lib/image';
import type { ImageSource } from './types';

/**
 * Turn any image source into a usable URL string.
 *  - Plain strings (sample content) are returned as-is.
 *  - Sanity image objects are run through the image-url builder.
 *  - Anything else returns null so the component can render a graceful
 *    fallback instead of a broken <img>.
 */
export function resolveImageUrl(
  source: ImageSource,
  width?: number
): string | null {
  if (!source) return null;
  if (typeof source === 'string') return source;

  const builder = urlForImage(source as never);
  if (!builder) return null;
  return width ? builder.width(width).url() : builder.url();
}
