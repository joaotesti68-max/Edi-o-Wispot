import {
  AbsoluteFill,
  Audio,
  Freeze,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CaptionCard } from "./CaptionCard";
import { NameCard } from "./NameCard";
import { NotificationToast } from "./NotificationToast";
import { SeriesBadge } from "./SeriesBadge";
import { TermBadge } from "./TermBadge";
import { WispotLogo } from "./WispotLogo";
import { FPS, buildCutSegments, type Block } from "./series";

// Voiceover track for the block, straight-cut around any mid-clip `cuts`
// (no crossfade — the visual is the full-screen demo, not her face, so a
// hard audio splice doesn't show).
const NarrationAudio: React.FC<{ block: Block }> = ({ block }) => {
  if (!block.cuts?.length) {
    return <Audio src={staticFile(block.video)} trimBefore={block.trimBefore} trimAfter={block.trimAfter} />;
  }
  const segments = buildCutSegments(block.trimBefore ?? 0, block.trimAfter ?? 0, block.cuts, FPS);
  return (
    <>
      {segments.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.durationInFrames} layout="none">
          <Audio src={staticFile(block.video)} trimBefore={s.originalStart} trimAfter={s.originalEnd} />
        </Sequence>
      ))}
    </>
  );
};

export const TalkingHeadBlock: React.FC<{
  block: Block;
  seriesLabel: string;
  episodeNumber: number;
}> = ({ block, seriesLabel, episodeNumber }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  const watermarkOpacity = interpolate(frame, [0, 12], [0, 0.92], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {block.demoVideo ? (
        <>
          <NarrationAudio block={block} />
          <Freeze frame={block.demoVideo.freezeAtFrame} active={frame >= block.demoVideo.freezeAtFrame}>
            <OffthreadVideo
              src={staticFile(block.demoVideo.src)}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Freeze>
        </>
      ) : (
        <AbsoluteFill style={{ transform: `scale(${kenBurns})` }}>
          <OffthreadVideo
            src={staticFile(block.video)}
            trimBefore={block.trimBefore}
            trimAfter={block.trimAfter}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,20,32,0.15) 0%, rgba(13,20,32,0) 24%, rgba(13,20,32,0) 46%, rgba(13,20,32,0.72) 80%, rgba(9,14,24,0.88) 100%)",
        }}
      />

      <SeriesBadge seriesLabel={seriesLabel} episodeNumber={episodeNumber} />

      {block.nameCard ? <NameCard name={block.nameCard.name} role={block.nameCard.role} /> : null}

      <div
        style={{
          position: "absolute",
          top: 60,
          right: 48,
          opacity: watermarkOpacity,
          background: "rgba(13,20,32,0.55)",
          borderRadius: 10,
          padding: "10px 14px",
        }}
      >
        <WispotLogo size={24} showTagline={false} />
      </div>

      {block.termBadge ? <TermBadge text={block.termBadge.text} appearFrame={block.termBadge.appearFrame} /> : null}

      {block.notifications?.map((n, i) => (
        <NotificationToast key={i} {...n} />
      ))}

      <CaptionCard captions={block.captions} kicker={block.kicker} />
    </AbsoluteFill>
  );
};
