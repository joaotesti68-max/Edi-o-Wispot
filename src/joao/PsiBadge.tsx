import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";

/**
 * Cartão que abre a sigla, no momento em que ele fala "Política de Segurança
 * da Informação" na abertura.
 */
export const PsiBadge: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - start, fps, config: { damping: 13, mass: 0.7 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const scale = interpolate(enter, [0, 1], [0.72, 1]);

  return (
    <div
      style={{
        position: "absolute",
        // Acima da cabeça dele: o bloco aproxima a imagem no mesmo momento em
        // que esse card entra, e mais embaixo ele cairia sobre o rosto.
        top: 196,
        left: 56,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "20px 32px",
        borderRadius: 20,
        background: "rgba(6,9,12,0.88)",
        border: `2px solid ${brand.colors.primaryLight}`,
        boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    >
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 800,
          fontSize: 62,
          letterSpacing: 1,
          color: brand.colors.primaryLight,
        }}
      >
        PSI
      </div>
      <div style={{ width: 2, height: 54, background: "rgba(255,255,255,0.22)" }} />
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 30,
          lineHeight: 1.24,
          color: brand.colors.white,
          maxWidth: 420,
        }}
      >
        Política de Segurança
        <br />
        da Informação
      </div>
    </div>
  );
};
