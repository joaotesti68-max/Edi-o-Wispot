import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { brand } from "../brand";
import type { Keyword, Part, Segment } from "./edit";
import { FPS, toSegmentFrame } from "./edit";

// Clean lower-third label: white card, brand-blue accent, calm fade-in.
const KeywordLabel: React.FC<{ keyword: Keyword; start: number }> = ({
  keyword,
  start,
}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const t = interpolate(frame - start, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        alignSelf: "flex-start",
        opacity: t,
        transform: `translateX(${interpolate(t, [0, 1], [-24, 0])}px)`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: "rgba(255,255,255,0.94)",
        color: brand.colors.ink,
        fontFamily: brand.fontFamily,
        fontWeight: 700,
        fontSize: 42,
        padding: "18px 32px 18px 22px",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: 6,
          height: 40,
          borderRadius: 3,
          background: brand.colors.primary,
        }}
      />
      {keyword.text}
    </div>
  );
};

// On-camera takes use the skin-smoothed renders (scripts/skin-smooth.sh).
const softSrc = (src: string) =>
  src.replace("videos/clips/", "videos/clips-soft/");

// One surviving stretch of a talking take. Every other part sits slightly
// tighter so the jump cuts read as deliberate.
const TalkPart: React.FC<{
  src: string;
  part: Part;
  zoom: number;
  index: number;
}> = ({ src, part, zoom, index }) => {
  const frame = useCurrentFrame();
  const scale =
    zoom *
    (index % 2 === 1 ? 1.05 : 1) *
    interpolate(frame, [0, part.durationInFrames], [1, 1.02]);
  return (
    <AbsoluteFill
      style={{ transform: `scale(${scale})`, transformOrigin: "50% 30%" }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={part.srcStart}
        trimAfter={part.srcStart + part.durationInFrames}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

export const SegmentView: React.FC<{ segment: Segment }> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { clip, parts, motionGraphic, zoom, keywords } = segment;

  if (motionGraphic) {
    // Off-camera reading: keep the voice, show the animation instead. The
    // animation is timed to the original take, so it is cut at the same points.
    const mgOrigin = Math.round(clip.trimIn * FPS);
    return (
      <AbsoluteFill style={{ background: "#f4f7fa" }}>
        {parts.map((part) => (
          <Sequence
            key={part.from}
            from={part.from}
            durationInFrames={part.durationInFrames}
          >
            <Audio
              src={staticFile(clip.src)}
              trimBefore={part.srcStart}
              trimAfter={part.srcStart + part.durationInFrames}
            />
            <OffthreadVideo
              muted
              src={staticFile(motionGraphic)}
              trimBefore={Math.max(0, part.srcStart - mgOrigin)}
              trimAfter={
                Math.max(0, part.srcStart - mgOrigin) + part.durationInFrames
              }
            />
          </Sequence>
        ))}
      </AbsoluteFill>
    );
  }

  const watermark = interpolate(frame, [0, 10], [0, 0.9], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {parts.map((part, i) => (
        <Sequence
          key={part.from}
          from={part.from}
          durationInFrames={part.durationInFrames}
        >
          <TalkPart src={softSrc(clip.src)} part={part} zoom={zoom} index={i} />
        </Sequence>
      ))}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(6,9,12,0.35) 0%, rgba(6,9,12,0) 22%, rgba(6,9,12,0) 60%, rgba(6,9,12,0.55) 100%)",
        }}
      />

      <Img
        src={staticFile(brand.logo.iconWhite)}
        style={{
          position: "absolute",
          top: 60,
          right: 52,
          width: 64,
          opacity: watermark,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 130,
          left: 56,
          right: 56,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {keywords.map((k) => (
          <KeywordLabel
            key={k.text}
            keyword={k}
            start={toSegmentFrame(segment, k.at)}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
