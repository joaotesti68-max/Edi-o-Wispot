import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";
import type { Block } from "./content";

export const VideoBlock: React.FC<{ block: Block }> = ({ block }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    extrapolateRight: "clamp",
  });

  const headlineIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, mass: 0.7 },
  });
  const headlineOpacity = interpolate(headlineIn, [0, 1], [0, 1]);
  const headlineShift = interpolate(headlineIn, [0, 1], [26, 0]);

  const watermarkOpacity = interpolate(frame, [0, 12], [0, 0.9], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${kenBurns})` }}>
        <OffthreadVideo
          src={staticFile(block.video)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(10,14,18,0.72) 82%, rgba(6,9,12,0.88) 100%)",
        }}
      />

      <Img
        src={staticFile(brand.logo.iconWhite)}
        style={{
          position: "absolute",
          top: 56,
          right: 48,
          width: 68,
          opacity: watermarkOpacity,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 120,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          opacity: headlineOpacity,
          transform: `translateY(${headlineShift}px)`,
        }}
      >
        <div style={{ width: 56, height: 6, background: brand.colors.primaryLight, borderRadius: 3 }} />
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 58,
            lineHeight: 1.12,
            color: brand.colors.white,
            letterSpacing: -0.5,
            textShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
        >
          {block.headline}
        </div>

        {block.chips ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
            {block.chips.map((chip, i) => {
              const chipIn = spring({
                frame: frame - 20 - i * 4,
                fps,
                config: { damping: 16 },
              });
              return (
                <div
                  key={chip}
                  style={{
                    opacity: interpolate(chipIn, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(chipIn, [0, 1], [10, 0])}px)`,
                    fontFamily: brand.fontFamily,
                    fontWeight: 700,
                    fontSize: 26,
                    color: brand.colors.white,
                    background: "rgba(54,150,205,0.35)",
                    border: `1.5px solid ${brand.colors.primaryLight}`,
                    borderRadius: 999,
                    padding: "10px 22px",
                  }}
                >
                  {chip}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
