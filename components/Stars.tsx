/** Render a 0-5 star rating using filled/empty star glyphs. */
export function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  const stars = '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full);
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`} role="img">
      {stars}
    </span>
  );
}
