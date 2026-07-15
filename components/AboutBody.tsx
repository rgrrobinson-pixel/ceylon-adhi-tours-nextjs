import { PortableText, type PortableTextBlock } from 'next-sanity';

/**
 * Render the About "body". This accepts either plain strings (sample content)
 * or Sanity Portable Text blocks (live CMS content) and renders both safely.
 */
export function AboutBody({ body }: { body?: PortableTextBlock[] | string[] }) {
  if (!body || body.length === 0) return null;

  // Plain string array (sample content).
  if (typeof body[0] === 'string') {
    return (
      <>
        {(body as string[]).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </>
    );
  }

  // Portable Text from Sanity.
  return <PortableText value={body as PortableTextBlock[]} />;
}
