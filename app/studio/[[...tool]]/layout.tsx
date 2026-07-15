/**
 * Minimal layout for the Studio route. The Studio renders its own full-screen
 * UI, so we just pass children through without the marketing-site chrome.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
