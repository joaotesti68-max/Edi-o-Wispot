import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";
import { Captions } from "./Captions";
import { InfoCard } from "./InfoCard";
import { NameCard } from "./NameCard";
import type { Block } from "./content";

export const VideoBlock: React.FC<{ block: Block }> = ({ block }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

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
            "linear-gradient(to bottom, rgba(4,7,10,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 52%, rgba(8,12,16,0.62) 76%, rgba(5,8,11,0.86) 100%)",
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

      {block.presenter ? (
        <NameCard name={block.presenter.name} role={block.presenter.role} />
      ) : null}

      {block.cards.map((card, i) => (
        <Sequence key={i} from={card.from} durationInFrames={card.durationInFrames} layout="none">
          <InfoCard card={card} />
        </Sequence>
      ))}

      <Captions captionKey={block.captionKey} />
    </AbsoluteFill>
  );
};
