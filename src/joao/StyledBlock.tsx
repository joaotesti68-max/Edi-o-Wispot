import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BlockChrome } from "../BlockChrome";
import { BulletList } from "./BulletList";
import { PsiBadge } from "./PsiBadge";
import { TakeSeries } from "./RawCut";
import { punchStart, takeStart, type ScriptClip } from "./takes";

const PUNCH_IN_FRAMES = 9;
const PUNCH_OUT_FRAMES = 16;

export const StyledBlock: React.FC<{ clip: ScriptClip }> = ({ clip }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  const { punch } = clip;
  const punchScale = punch
    ? interpolate(
        frame,
        [
          punchStart(clip, punch),
          punchStart(clip, punch) + PUNCH_IN_FRAMES,
          punchStart(clip, punch) + PUNCH_IN_FRAMES + (punch.hold ?? 60),
          punchStart(clip, punch) + PUNCH_IN_FRAMES + (punch.hold ?? 60) + PUNCH_OUT_FRAMES,
        ],
        [1, punch.scale ?? 1.18, punch.scale ?? 1.18, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
      )
    : 1;

  const hasBullets = Boolean(clip.bullets?.length);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${kenBurns * punchScale})`,
          // Ancorado no rosto: no centro do quadro o zoom sobe a cabeça dele
          // pra fora do enquadramento.
          transformOrigin: "50% 30%",
        }}
      >
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
