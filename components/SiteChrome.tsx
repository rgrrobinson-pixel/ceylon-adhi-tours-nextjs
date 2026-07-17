/**
 * SiteChrome – shared header + footer used by all pages (homepage delegates
 * its own header/footer markup; inner pages use this component).
 *
 * Accepts the business settings it needs as props so the caller can fetch
 * once and pass down, keeping each page a single async server component.
 */
import { LogoMark } from './Logo';
import type { ImageSource, SiteContent } from '@/lib/types';
import { resolveImageUrl } from '@/lib/resolveImage';
import { getAllLandingPages } from '@/lib/getPages';

interface SiteChromeProps {
  content?: SiteContent;
  businessName?: string;
  areaServed?: string;
  logo?: ImageSource;
  whatsappNumber?: string;
  showPackages?: boolean;
  hasGallery?: boolean;
  hasDestinations?: boolean;
  hasVideos?: boolean;
  children: React.ReactNode;
}

function whatsappHref(num?: string) {
  if (!num) return undefined;
  const digits = num.replace(/[^0-9]/g, '');
  return digits ? `https://wa.me/${digits}` : undefined;
}

export async function SiteChrome({
  content,
  businessName,
  areaServed,
  logo,
  whatsappNumber,
  children,
}: SiteChromeProps) {
  const settings = content?.settings;
  const resolvedBusinessName = businessName || settings?.businessName || 'Ceylon Adhi Tours';
  const resolvedAreaServed = areaServed ?? settings?.areaServed;
  const resolvedLogo = logo ?? settings?.logo;
  const resolvedWhatsappNumber = whatsappNumber ?? settings?.whatsappNumber;
  const logoUrl = resolvedLogo ? resolveImageUrl(resolvedLogo, 480) : null;
  const waHref = whatsappHref(resolvedWhatsappNumber);
  const landingPages = await getAllLandingPages();
  const staticLandingSlugs = new Set([
    'family-tours-sri-lanka',
    'group-tours-sri-lanka',
  ]);
  const visibleLandingPages = landingPages.filter(
    (page) => page.slug && !staticLandingSlugs.has(page.slug),
  );

  return (
    <>
      {/* Header */}
      <header className="site-header">
        <div className="container site-header__inner">
          <a
            className={`brand${logoUrl ? ' brand--has-logo' : ''}`}
            href="/"
            aria-label={resolvedBusinessName}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="brand__logo" src={logoUrl} alt={resolvedBusinessName} />
            ) : (
              <>
                <LogoMark />
                <span>{resolvedBusinessName}</span>
              </>
            )}
          </a>
          <nav className="nav" aria-label="Primary">
            <a href="/#about">About</a>
            <a href="/#packages">Tours</a>
            <a href="/itineraries">Itineraries</a>
            <a href="/destinations">Destinations</a>
            <a href="/#reviews">Reviews</a>
            <a href="/#faq">FAQ</a>
            <a href="/#contact">Contact</a>
          </nav>
          <details className="nav-mobile">
            <summary aria-label="Open menu">
              <span className="nav-mobile__bars" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span className="nav-mobile__label">Menu</span>
            </summary>
            <nav className="nav-mobile__panel" aria-label="Mobile">
              <a href="/#about">About</a>
              <a href="/#packages">Tours</a>
              <a href="/itineraries">Itineraries</a>
              <a href="/destinations">Destinations</a>
              <a href="/#reviews">Reviews</a>
              <a href="/#faq">FAQ</a>
              <a href="/#contact">Contact</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="top">
        {children}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span>
            &copy; {new Date().getFullYear()} {resolvedBusinessName}
            {resolvedAreaServed ? ` · ${resolvedAreaServed}` : ''}
          </span>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/itineraries">Itineraries</a>
            <a href="/destinations">Destinations</a>
            <a href="/#contact">Contact</a>
            {waHref && (
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            )}
            <a
              href="https://www.facebook.com/profile.php?id=61575833057687"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </nav>
        </div>
        <div
          className="container"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.14)',
            marginTop: '1rem',
            paddingTop: '1rem',
          }}
        >
          <p style={{ margin: '0 0 0.75rem', fontWeight: 700 }}>
            Helpful Sri Lanka tour pages
          </p>
          <nav
            aria-label="Helpful tour pages"
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <a href="/family-tours-sri-lanka">Family tours</a>
            <a href="/group-tours-sri-lanka">Group tours</a>
            {visibleLandingPages.map((page) => (
              <a href={`/${page.slug}`} key={page._id}>
                {page.title}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
