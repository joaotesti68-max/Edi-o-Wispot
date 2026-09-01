import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BlockChrome } from "../BlockChrome";
import { BulletList } from "./BulletList";
import { PsiBadge } from "./PsiBadge";
import { TakeSeries } from "./RawCut";
import { takeStart, type ScriptClip } from "./takes";

export const StyledBlock: React.FC<{ clip: ScriptClip }> = ({ clip }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  const hasBullets = Boolean(clip.bullets?.length);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${kenBurns})` }}>
        <TakeSeries takes={clip.takes} />
      </AbsoluteFill>

      {/* A sigla abre junto com a segunda take da abertura, que é onde ele
          fala o nome por extenso. */}
      {clip.id === "abertura" ? <PsiBadge start={takeStart(clip, 1)} /> : null}

      <BlockChrome
        headline={clip.headline}
        icon={clip.icon}
        nameCard={clip.nameCard}
        headlineSize={hasBullets ? 46 : 58}
        scrim={hasBullets ? "tall" : "default"}
      >
        {clip.bullets ? <BulletList clip={clip} bullets={clip.bullets} /> : null}
      </BlockChrome>
    </AbsoluteFill>
  );
};
