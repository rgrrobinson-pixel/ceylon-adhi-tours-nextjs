/**
 * Custom inline SVG logo mark – a compass/sun motif suited to a travel guide.
 * Uses currentColor so it adapts to context.
 */
export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      className="brand__mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M16 6 L19.5 16 L16 26 L12.5 16 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="16" cy="16" r="2.4" fill="#faf7f2" />
    </svg>
  );
}
