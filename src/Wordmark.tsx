import { Img, staticFile } from "remotion";
import { brand } from "./brand";

/**
 * Logo da Wispot. Enquanto o PNG oficial não estiver em public/brand/,
 * cai num fallback tipográfico em Montserrat para o layout não quebrar.
 */
export const Wordmark: React.FC<{ height?: number; variant?: "white" | "color" }> = ({
  height = 44,
  variant = "white",
}) => {
  const hasAsset = false; // vira true quando o arquivo oficial entrar no repo

  if (hasAsset) {
    return <Img src={staticFile(brand.logo[variant])} style={{ height }} />;
  }

  return (
    <div
      style={{
        fontFamily: brand.fontFamily,
        fontWeight: 800,
        fontSize: height * 0.86,
        letterSpacing: -1,
        color: variant === "white" ? brand.colors.white : brand.colors.blue,
        lineHeight: 1,
      }}
    >
      wispot
    </div>
  );
};
