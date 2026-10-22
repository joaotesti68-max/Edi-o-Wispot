import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Clip } from "./edit";
import { pa } from "./theme";

// Where João's face sits in the 1080×1920 takes.
export const FACE = { x: 600, y: 820 };
// The bubble he shrinks into while the news prints are on screen.
export const PIP = { x: 270, y: 1600, r: 215, scale: 0.56 };

// Dark newsroom backdrop behind the prints: navy, a slow grid and two glows.
export const StageBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: pa.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(54,150,205,0.13) 2px, transparent 2px), linear-gradient(90deg, rgba(54,150,205,0.13) 2px, transparent 2px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${(frame * 1.2) % 90}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 80% 18%, rgba(32,163,214,0.35) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(54,150,205,0.3) 0%, transparent 40%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const TalkClip: React.FC<{
  clip: Clip;
  // Animate from full frame into the bubble (first clip of a print run).
  shrink?: boolean;
  children?: React.ReactNode;
}> = ({ clip, shrink, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = clip.out - clip.in;

  const video = (
    <OffthreadVideo
      src={staticFile(`videos/smart/${clip.id}.mp4`)}
      trimBefore={clip.in}
      trimAfter={clip.out}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );

  if (clip.mode === "pip") {
    const p = shrink ? spring({ frame, fps, config: { damping: 16 } }) : 1;
    const s = interpolate(p, [0, 1], [1, PIP.scale]);
    const tx = interpolate(p, [0, 1], [0, PIP.x - FACE.x * PIP.scale]);
    const ty = interpolate(p, [0, 1], [0, PIP.y - FACE.y * PIP.scale]);
    const r = interpolate(p, [0, 1], [1300, PIP.r]);
    const cx = interpolate(p, [0, 1], [FACE.x, PIP.x]);
    const cy = interpolate(p, [0, 1], [FACE.y, PIP.y]);
    return (
      <AbsoluteFill>
        <StageBackground />
        <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
          <AbsoluteFill
            style={{
              transformOrigin: "0 0",
              transform: `translate(${tx}px, ${ty}px) scale(${s})`,
            }}
          >
            {video}
          </AbsoluteFill>
        </AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: PIP.x - PIP.r - 9,
            top: PIP.y - PIP.r - 9,
            width: (PIP.r + 9) * 2,
            height: (PIP.r + 9) * 2,
            borderRadius: "50%",
            border: `9px solid ${pa.cyan}`,
            boxShadow: "0 0 60px rgba(32,163,214,0.55)",
            opacity: interpolate(p, [0.6, 1], [0, 1]),
          }}
        />
      </AbsoluteFill>
    );
  }

  const settle = spring({ frame, fps, config: { damping: 18 } });
  const scale =
    clip.zoom *
    interpolate(settle, [0, 1], [1.06, 1]) *
    interpolate(frame, [0, duration], [1, 1.035]);
  return (
    <AbsoluteFill style={{ background: pa.ink }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: `${FACE.x}px ${FACE.y}px`,
        }}
      >
        {video}
        {children}
      </AbsoluteFill>
      {/* Cool grade and a darker foot so the graphics read on the shirt */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,21,32,0.55) 0%, rgba(10,21,32,0) 18%, rgba(10,21,32,0) 50%, rgba(10,21,32,0.6) 100%)",
        }}
      />
      <AbsoluteFill
        style={{ background: "rgba(32,110,170,0.08)", mixBlendMode: "color" }}
      />
    </AbsoluteFill>
  );
};
