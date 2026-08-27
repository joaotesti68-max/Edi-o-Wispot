import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand } from "./brand";
import { Clip } from "./Clip";
import { Headline } from "./Headline";
import { NameCard } from "./NameCard";
import { Takeover, takeoverProgress } from "./Takeover";
import { Visual } from "./Visuals";
import { blockDuration, blockRanges, clipsFor, takeStartsFor, type Block } from "./content";

export const BlockView: React.FC<{ block: Block; index: number }> = ({ block, index }) => {
  const frame = useCurrentFrame();
  const watermarkOpacity = interpolate(frame, [0, 12], [0, 0.9], { extrapolateRight: "clamp" });
  // Enquanto a tela cheia sobe, os overlays normais saem na mesma curva.
  const covered = takeoverProgress(frame, block.takeover);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip clips={clipsFor(block)} blockStart={blockRanges[index].start} />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 44%, rgba(10,14,18,0.74) 74%, rgba(6,9,12,0.9) 100%)",
        }}
      />

      <Img
        src={staticFile(brand.logo.iconWhite)}
        style={{
          position: "absolute",
          top: 62,
          right: 56,
          width: 68,
          opacity: watermarkOpacity * (1 - covered),
        }}
      />

      <div style={{ opacity: 1 - covered }}>
        {block.nameCard ? <NameCard name={block.nameCard} /> : null}
      </div>

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 72,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          opacity: 1 - covered,
        }}
      >
        <Visual visual={block.visual} takeStarts={takeStartsFor(block)} />
        <Headline kicker={block.kicker} headline={block.headline} highlight={block.highlight} />
      </div>

      {block.takeover ? (
        <Takeover takeover={block.takeover} duration={blockDuration(block)} />
      ) : null}
    </AbsoluteFill>
  );
};
