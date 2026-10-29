import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "../loadFont";
import { CameraScene } from "./CameraScene";
import { END_FRAMES, FPS, endStart, sceneStarts, scenes, totalDurationInFrames } from "./edit";
import { MgAntivirus } from "./MgAntivirus";
import { MgIsolate } from "./MgIsolate";
import { Sfx } from "./Overlays";
import { TileGrid, pa } from "./theme";

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = interpolate(frame, [0, 12], [0, 120], { extrapolateRight: "clamp" });
  const logo = spring({ frame: frame - 6, fps, config: { damping: 11 } });
  const line = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const site = spring({ frame: frame - 26, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}% at 50% 50%)`, fontFamily: pa.font }}>
      <AbsoluteFill style={{ background: pa.grad }} />
      <TileGrid opacity={0.08} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60 }}>
        <Img
          src={staticFile(pa.logoWhite)}
          style={{
            width: 820,
            opacity: logo,
            transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`,
          }}
        />
        <div
          style={{
            color: pa.white,
            fontWeight: 700,
            fontSize: 46,
            textAlign: "center",
            lineHeight: 1.3,
            opacity: line,
            transform: `translateY(${interpolate(line, [0, 1], [40, 0])}px)`,
          }}
        >
          Segurança de endpoints
          <br />
          para a sua empresa
        </div>
        <div
          style={{
            background: pa.white,
            color: pa.blue,
            fontWeight: 800,
            fontSize: 50,
            padding: "22px 56px",
            borderRadius: 999,
            opacity: site,
            transform: `translateY(${interpolate(site, [0, 1], [60, 0])}px)`,
          }}
        >
          {pa.site}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Music sits under the voice and lifts on the end card.
const musicVolume = (f: number) =>
  interpolate(
    f,
    [0, 12, endStart, endStart + 10, totalDurationInFrames - 20, totalDurationInFrames],
    [0.22, 0.08, 0.08, 0.3, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

export const EndpointVideo: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, background: pa.deep }}>
    <Audio src={staticFile("audio/funky-funky.mp3")} volume={musicVolume} />
    {scenes.map((scene, i) => (
      <Sequence
        key={scene.id}
        from={sceneStarts[i]}
        durationInFrames={scene.durationInFrames}
      >
        {scene.mode === "antivirus" ? (
          <MgAntivirus scene={scene} />
        ) : scene.mode === "isolate" ? (
          <MgIsolate scene={scene} />
        ) : (
          <CameraScene scene={scene} first={i === 0} />
        )}
      </Sequence>
    ))}
    <Sequence from={endStart} durationInFrames={END_FRAMES}>
      <EndCard />
    </Sequence>
    <Sfx at={endStart} src="audio/sfx/whoosh.wav" volume={0.32} />
  </AbsoluteFill>
);

export const EndpointComposition = () => (
  <Composition
    id="EndpointProAdvanced"
    component={EndpointVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
