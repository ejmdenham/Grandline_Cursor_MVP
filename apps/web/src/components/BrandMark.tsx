export function BrandMark({
  overline = "ADMIN",
  showName = true,
}: {
  overline?: string;
  showName?: boolean;
}) {
  return (
    <div className="brand-mark">
      <div className="brand-mark__rule" aria-hidden="true">
        <span className="brand-mark__tick" />
      </div>
      {showName ? <p className="brand-mark__name">Grandline</p> : null}
      <p className="brand-mark__overline">{overline}</p>
    </div>
  );
}
