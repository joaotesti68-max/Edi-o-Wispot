import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";
import type { Keyword, Segment, Tone } from "./edit";
import { FPS } from "./edit";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  red: { bg: "#ff4d5e", fg: "#ffffff" },
  amber: { bg: "#ffb020", fg: "#0b1a26" },
  blue: { bg: brand.colors.primaryLight, fg: "#ffffff" },
  green: { bg: "#2fd18b", fg: "#0b1a26" },
};

const KeywordChip: React.FC<{ keyword: Keyword; index: number }> = ({ keyword, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = Math.round(keyword.at * FPS);
  const t = spring({ frame: frame - start, fps, config: { damping: 11, mass: 0.6 } });
  if (frame < start) return null;
  const tone = TONES[keyword.tone];
  const tilt = index % 2 === 0 ? -3 : 3;
  return (
    <div
      style={{
        alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
        transform: `scale(${t}) rotate(${interpolate(t, [0, 1], [tilt * 4, tilt])}deg)`,
        background: tone.bg,
        color: tone.fg,
        fontFamily: brand.fontFamily,
        fontWeight: 800,
        fontSize: 44,
        letterSpacing: 0.5,
        padding: "12px 30px",
        borderRadius: 999,
        border: "5px solid #0b1a26",
        boxShadow: "0 10px 0 rgba(11,26,38,0.75)",
        whiteSpace: "nowrap",
      }}
    >
      {keyword.text}
    </div>
  );
};

export const SegmentView: React.FC<{ segment: Segment }> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { clip, durationInFrames, motionGraphic, zoom, keywords } = segment;
  const trimBefore = Math.round(clip.trimIn * FPS);
  const trimAfter = trimBefore + durationInFrames;

  if (motionGraphic) {
    // Off-camera reading: keep the voice, show the animation instead.
    const flash = interpolate(frame, [0, 6], [1, 0], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ background: "#0b1a26" }}>
        <Audio src={staticFile(clip.src)} trimBefore={trimBefore} trimAfter={trimAfter} />
        <OffthreadVideo muted src={staticFile(motionGraphic)} />
        <AbsoluteFill style={{ background: "#ffffff", opacity: flash * 0.8 }} />
      </AbsoluteFill>
    );
  }

  // Each cut lands with a short punch-in settle, then a slow push.
  const settle = spring({ frame, fps, config: { damping: 18, mass: 0.6 } });
  const scale = zoom * interpolate(settle, [0, 1], [1.06, 1]) * interpolate(frame, [0, durationInFrames], [1, 1.035]);
  const watermark = interpolate(frame, [0, 10], [0, 0.9], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 30%" }}>
        <OffthreadVideo
          src={staticFile(clip.src)}
          trimBefore={trimBefore}
          trimAfter={trimAfter}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(6,9,12,0.35) 0%, rgba(6,9,12,0) 22%, rgba(6,9,12,0) 60%, rgba(6,9,12,0.55) 100%)",
        }}
      />

      <Img
        src={staticFile(brand.logo.iconWhite)}
        style={{ position: "absolute", top: 60, right: 52, width: 64, opacity: watermark }}
      />

      <div
        style={{
          position: "absolute",
          top: 130,
          left: 56,
          right: 56,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {keywords.map((k, i) => (
          <KeywordChip key={k.text} keyword={k} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
