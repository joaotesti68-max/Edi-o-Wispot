import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PLAYBACK_RATE, type Clip } from "./content";

export const ClipBlock: React.FC<{ clip: Clip }> = ({ clip }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const drift = interpolate(frame, [0, durationInFrames], [1.02, 1.07], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift})` }}>
        <OffthreadVideo
          src={staticFile(clip.video)}
          trimBefore={clip.trimBefore}
          trimAfter={clip.trimAfter}
          playbackRate={PLAYBACK_RATE}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,13,22,0.55) 0%, rgba(5,13,22,0) 22%, rgba(5,13,22,0) 58%, rgba(5,13,22,0.72) 86%, rgba(5,13,22,0.9) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
