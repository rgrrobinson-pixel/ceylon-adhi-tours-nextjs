import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllLandingPageSlugs, getLandingPageBySlug } from '@/lib/getPages';
import { getSiteContent } from '@/lib/getContent';
import { resolveImageUrl } from '@/lib/resolveImage';
import { LandingPageView } from '@/components/LandingPageView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceylonadhitours.com';

const RESERVED_SLUGS = new Set([
  'api',
  'destinations',
  'itineraries',
  'studio',
  'family-tours-sri-lanka',
  'group-tours-sri-lanka',
]);

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllLandingPageSlugs();
  return slugs
    .filter((slug) => !RESERVED_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (RESERVED_SLUGS.has(params.slug)) return {};

  const landingPage = await getLandingPageBySlug(params.slug);
  if (!landingPage) return {};

  const { content } = await getSiteContent();
  const title =
    landingPage.seoTitle ||
    `${landingPage.title} — ${content.settings.businessName}`;
  const description = landingPage.seoDescription || landingPage.summary;
  const ogImage = landingPage.heroImage
    ? resolveImageUrl(landingPage.heroImage, 1200)
    : null;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: `/${landingPage.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${landingPage.slug}`,
      siteName: content.settings.businessName,
      images: ogImage
        ? [{ url: ogImage, width: 1200, alt: landingPage.title }]
        : undefined,
    },
  };
}

export default async function LandingPageRoute({ params }: Props) {
  if (RESERVED_SLUGS.has(params.slug)) notFound();

  const [landingPage, { content }] = await Promise.all([
    getLandingPageBySlug(params.slug),
    getSiteContent(),
  ]);

  if (!landingPage) notFound();

  return <LandingPageView landingPage={landingPage} content={content} />;
}
