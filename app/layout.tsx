import type { Metadata } from 'next';
import './globals.css';
import { getSiteContent } from '@/lib/getContent';
import { resolveImageUrl } from '@/lib/resolveImage';
import ChatWidget from '@/components/ChatWidget';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceylonadhitours.com';

/**
 * Metadata is driven by the CMS content (siteSettings + hero), with a safe
 * fallback when no Sanity project is configured yet.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSiteContent();
  const { settings, hero, about } = content;

  const title = settings.tagline
    ? `${settings.businessName} - ${settings.tagline}`
    : settings.businessName;
  const description =
    hero.subheadline ||
    settings.tagline ||
    `${settings.businessName}${
      settings.areaServed ? ` in ${settings.areaServed}` : ''
    }.`;

  // Social preview image: prefer the hero photo, fall back to the portrait or
  // logo. A real photo previews far better than a blank card when links are
  // shared (WhatsApp, Facebook, etc.).
  const ogSource = hero.heroImage || about?.portrait || settings.logo;
  const ogImage = ogSource ? resolveImageUrl(ogSource, 1200) : null;
  const images = ogImage ? [{ url: ogImage, width: 1200, alt: title }] :
    undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: SITE_URL,
      siteName: settings.businessName,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read the brand colour from the CMS so the whole site re-themes when the
  // owner changes it. Falls back to the default teal.
  const { content } = await getSiteContent();
  const brand = content.settings.primaryColor || '#0f766e';

  // Website style chosen by the owner in the Studio. Falls back to 'classic'.
  const allowedThemes = ['classic', 'bold', 'minimal'] as const;
  const theme = (allowedThemes as readonly string[]).includes(
    content.settings.theme as string,
  )
    ? (content.settings.theme as string)
    : 'classic';

  // WhatsApp number for the assistant's handoff button. Driven by the CMS so
  // the owner can change it; falls back to Adhi's known number.
  const whatsapp = content.settings.whatsappNumber || '94701119491';

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Space+Grotesk:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Inter+Tight:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div
          style={{ ['--brand' as string]: brand }}
        >
          {children}
        </div>
        <ChatWidget accent={brand} whatsapp={whatsapp} />
      </body>
    </html>
  );
}
