import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { yt } from "./theme";

/** The screen recording of the channel, floated over the take as a card. */
export const ChannelScroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.8 } });
  const out = interpolate(frame, [durationInFrames - 16, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          bottom: 250,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [150, 0])}px) scale(${interpolate(
            enter,
            [0, 1],
            [0.92, 1],
          )})`,
        }}
      >
        <div
          style={{
            borderRadius: 26,
            overflow: "hidden",
            border: `3px solid ${yt.colors.white}`,
            boxShadow: "0 28px 70px rgba(0,0,0,0.5)",
            background: yt.colors.white,
            lineHeight: 0,
          }}
        >
          <OffthreadVideo
            src={staticFile("videos/youtube/canal-wispot.mp4")}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
