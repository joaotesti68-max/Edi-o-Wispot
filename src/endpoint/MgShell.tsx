import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene } from "./edit";
import { Sfx } from "./Overlays";
import type { IconKind } from "./theme";
import { Icon, TileGrid, pa } from "./theme";

// Index of the last start at or before `frame`, -1 if none.
export const lastStarted = (starts: number[], frame: number) =>
  starts.reduce((acc, s, i) => (frame >= s ? i : acc), -1);

// Full-screen motion graphics over an off-camera take: only the take's
// audio is used, the graphics cut in straight away.
export const MgShell: React.FC<{ scene: Scene; children: React.ReactNode }> = ({
  scene,
  children,
}) => (
  <AbsoluteFill style={{ background: pa.deep }}>
    {scene.parts.map((part) => (
      <Sequence key={part.from} from={part.from} durationInFrames={part.durationInFrames}>
        <Audio
          src={staticFile(scene.src)}
          trimBefore={part.srcStart}
          trimAfter={part.srcStart + part.durationInFrames}
        />
      </Sequence>
    ))}
    <AbsoluteFill style={{ background: pa.grad }} />
    <TileGrid opacity={0.07} />
    {children}
    <Sfx at={0} src="audio/sfx/whoosh.wav" volume={0.32} />
  </AbsoluteFill>
);

// System notification that slides in from the top and is replaced by the
// next one, the way a security console reports what it is doing.
export const Toasts: React.FC<{
  items: { from: number; icon: IconKind; title: string; sub: string; dark?: boolean }[];
}> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = lastStarted(
    items.map((t) => t.from),
    frame,
  );
  if (idx < 0) return null;
  const t = items[idx];
  const s = spring({ frame: frame - t.from, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 230,
        left: 70,
        right: 70,
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "26px 34px",
        borderRadius: 34,
        background: t.dark ? pa.deep : pa.white,
        fontFamily: pa.font,
        boxShadow: "0 24px 60px rgba(28,63,87,0.35)",
        transform: `translateY(${interpolate(s, [0, 1], [-260, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 28,
          background: t.dark ? pa.light : pa.grad,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon kind={t.icon} size={60} strokeWidth={2.4} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontWeight: 800, fontSize: 44, color: t.dark ? pa.white : pa.deep }}>
          {t.title}
        </span>
        <span
          style={{
            fontWeight: 700,
            fontSize: 30,
            color: t.dark ? "rgba(255,255,255,0.75)" : pa.gray,
          }}
        >
          {t.sub}
        </span>
      </div>
    </div>
  );
};
