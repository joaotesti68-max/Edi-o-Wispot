import { Img, staticFile } from "remotion";

/**
 * Logomarca oficial (Manual de Identidade Wispot). O manual autoriza só duas
 * versões — branca e azul #25a8e0 — então `variant` cobre exatamente essas.
 * Os arquivos saíram do `wispot_colorido.png` do Drive, recortados no alpha.
 */

/** Proporções dos PNGs, para dimensionar pela altura sem distorcer. */
const LOCKUP_RATIO = 1912 / 897;
const ICON_RATIO = 485 / 238;

export const WispotMark: React.FC<{
  height: number;
  variant?: "white" | "color";
}> = ({ height, variant = "white" }) => (
  <Img
    src={staticFile(variant === "white" ? "brand/wispot-white.png" : "brand/wispot-color.png")}
    style={{ height, width: height * LOCKUP_RATIO, display: "block" }}
  />
);

/** Só os arcos de Wi-Fi do lockup, para usos pequenos ao lado de texto. */
export const WifiIcon: React.FC<{
  height: number;
  variant?: "white" | "color";
}> = ({ height, variant = "white" }) => (
  <Img
    src={staticFile(
      variant === "white" ? "brand/wispot-icon-white.png" : "brand/wispot-icon-color.png",
    )}
    style={{ height, width: height * ICON_RATIO, display: "block" }}
  />
);
