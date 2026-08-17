import { Img, staticFile } from "remotion";

// Official white logo (Manual de Identidade Wispot, 2026), vector PDF
// exported at high res. `showTagline=false` crops out "smart data" for
// compact watermark placements.
export const WispotLogo: React.FC<{
  size?: number;
  showTagline?: boolean;
}> = ({ size = 64, showTagline = true }) => {
  const src = showTagline
    ? staticFile("brand/wispot-logo-white-full.png")
    : staticFile("brand/wispot-logo-white-mark.png");
  // Both assets are ~2.12:1 (full) / ~2.58:1 (mark) width:height.
  const aspect = showTagline ? 2.118 : 2.579;

  return <Img src={src} style={{ width: size * aspect, height: size }} />;
};
