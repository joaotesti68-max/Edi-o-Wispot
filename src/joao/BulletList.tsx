import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { bulletStart, type Bullet, type ScriptClip } from "./takes";

const Row: React.FC<{ label: string; start: number }> = ({ label, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - start, fps, config: { damping: 15, mass: 0.6 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const shift = interpolate(enter, [0, 1], [22, 0]);
  // O item entra em destaque e depois assenta, pra o olho acompanhar a fala.
  const highlight = interpolate(frame - start, [0, 6, 34, 46], [0, 1, 1, 0.34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        // Alinhado ao topo, não ao centro: num rótulo que quebra em duas
        // linhas o marcador ficaria no meio das duas.
        alignItems: "flex-start",
        gap: 16,
        minHeight: 48,
        opacity,
        transform: `translateX(${shift}px)`,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          marginTop: 18,
          borderRadius: 999,
          flexShrink: 0,
          background: brand.colors.primaryLight,
          boxShadow: `0 0 ${16 * highlight}px ${brand.colors.primaryLight}`,
          transform: `scale(${interpolate(highlight, [0, 1], [0.8, 1.15])})`,
        }}
      />
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.2,
          letterSpacing: -0.3,
          color: brand.colors.white,
          opacity: interpolate(highlight, [0.34, 1], [0.72, 1]),
          textShadow: "0 3px 18px rgba(0,0,0,0.45)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Lista que acompanha a fala: cada item entra junto com a take que o menciona. */
export const BulletList: React.FC<{ clip: ScriptClip; bullets: Bullet[] }> = ({ clip, bullets }) => {
  return (
    // Todas as linhas ficam no layout desde o frame 0 — só a opacidade
    // anima — então a headline acima não se mexe conforme os itens entram.
    <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 6 }}>
      {bullets.map((bullet, i) => (
        <Row key={i} label={bullet.label} start={bulletStart(clip, bullet)} />
      ))}
    </div>
  );
};
