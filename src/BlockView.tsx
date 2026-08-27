import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand } from "./brand";
import { Clip } from "./Clip";
import { Headline } from "./Headline";
import { NameCard } from "./NameCard";
import { Visual } from "./Visuals";
import { clipsFor, takeStartsFor, type Block } from "./content";

export const BlockView: React.FC<{ block: Block; index: number }> = ({ block, index }) => {
  const frame = useCurrentFrame();
  const watermarkOpacity = interpolate(frame, [0, 12], [0, 0.9], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Cada bloco começa num enquadramento diferente do anterior. */}
      <Clip clips={clipsFor(block)} framingOffset={index} />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 44%, rgba(10,14,18,0.74) 74%, rgba(6,9,12,0.9) 100%)",
        }}
      />

      <Img
        src={staticFile(brand.logo.iconWhite)}
        style={{ position: "absolute", top: 62, right: 56, width: 68, opacity: watermarkOpacity }}
      />

      {block.nameCard ? <NameCard name={block.nameCard} /> : null}

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 72,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Visual visual={block.visual} takeStarts={takeStartsFor(block)} />
        <Headline kicker={block.kicker} headline={block.headline} highlight={block.highlight} />
      </div>
    </AbsoluteFill>
  );
};
