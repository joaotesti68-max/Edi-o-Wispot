import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  AttentionTag,
  Captions,
  Chips,
  CouponCard,
  CtaPill,
  DeadlineCard,
  Giant,
  MonthsCard,
  RevenueTag,
  Sticker,
  useIn,
} from "./Graphics";
import type { Take } from "./edit";
import { END_FRAMES, FPS, s, talkFrames, timeline, totalDurationInFrames } from "./edit";
import { bn } from "./theme";

// Graphics per take (times in seconds inside the take, matched to the speech).
const Overlay: React.FC<{ id: Take["id"] }> = ({ id }) => {
  switch (id) {
    case "hook":
      return (
        <>
          <Giant at={0.9} out={2.6} top={1230} size={150} sticker={1.25} />
          <CouponCard at={3.3} plus={4.78} />
        </>
      );
    case "oferta":
      return (
        <>
          <MonthsCard at={0.1} pay={2.29} out={3.55} />
          <RevenueTag at={6.2} />
        </>
      );
    case "publico":
      return (
        <>
          <Chips
            out={99}
            items={[
              { text: "Restaurantes", at: 0.92 },
              { text: "Varejo", at: 1.84 },
              { text: "Supermercados", at: 2.38 },
              { text: "Provedores de internet", at: 3.5 },
              { text: "Todo tipo de negócio", at: 5.46 },
            ]}
          />
        </>
      );
    case "urgencia":
      return (
        <>
          <AttentionTag at={0.1} out={2.2} />
          <DeadlineCard at={2.37} cta={3.85} />
        </>
      );
  }
};

const TakeView: React.FC<{ take: Take; durationInFrames: number; index: number }> = ({
  take,
  durationInFrames,
  index,
}) => {
  const frame = useCurrentFrame();
  // Short punch-in on every cut, then a slow push so the frame never sits still.
  const punch = interpolate(frame, [0, 8], [1.07, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const push = interpolate(frame, [0, durationInFrames], [1, 1.035]);
  return (
    <AbsoluteFill style={{ background: bn.ink }}>
      <AbsoluteFill style={{ transform: `scale(${punch * push})`, transformOrigin: "50% 35%" }}>
        <OffthreadVideo src={staticFile(take.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* legibility: dark fade at the bottom where captions and cards sit, light one on top for the logo */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,8,.6) 0%, rgba(5,6,8,.25) 16%, rgba(5,6,8,0) 24%, rgba(5,6,8,0) 48%, rgba(5,6,8,.55) 68%, rgba(5,6,8,.85) 100%)",
        }}
      />
      <Img
        src={staticFile(bn.logoWhite)}
        style={{ position: "absolute", top: 70, right: 64, height: 76, opacity: index === 0 ? interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }) : 1 }}
      />
      <Overlay id={take.id} />
      <Captions captions={take.captions} />
      {/* blue flash on the cut */}
      {index > 0 && (
        <AbsoluteFill
          style={{
            background: bn.blue,
            mixBlendMode: "screen",
            opacity: interpolate(frame, [0, 5], [0.45, 0], { extrapolateRight: "clamp" }),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const logo = useIn(0.15, 16);
  const deal = useIn(1.0, 15);
  const cta = useIn(1.45, 12);
  return (
    <AbsoluteFill style={{ background: bn.ink, opacity: fade, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 2200,
          height: 2200,
          left: -560,
          top: -1300,
          background: "radial-gradient(closest-side, rgba(37,168,224,.28), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 2000,
          height: 2000,
          left: -460,
          bottom: -1500,
          background: "radial-gradient(closest-side, rgba(37,168,224,.22), transparent 70%)",
        }}
      />
      <Img
        src={staticFile(bn.logoWhite)}
        style={{
          position: "absolute",
          left: 70,
          top: 190,
          height: 120,
          opacity: logo,
          transform: `translateY(${interpolate(logo, [0, 1], [-20, 0])}px)`,
        }}
      />
      <Giant at={0.3} top={470} size={168} />
      <div style={{ position: "absolute", right: 70, top: 380 }}>
        <Sticker at={0.75} size={230} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 900,
          opacity: deal,
          transform: `translateY(${interpolate(deal, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            border: `3px solid ${bn.blue}`,
            background: "rgba(37,168,224,.1)",
            color: bn.white,
            fontFamily: bn.title,
            fontWeight: 600,
            fontSize: 62,
            lineHeight: 1.15,
            padding: "24px 36px",
            borderRadius: 24,
          }}
        >
          18 meses de contrato
          <br />+ 3 meses grátis
        </div>
        <div style={{ marginTop: 30, fontFamily: bn.text, fontWeight: 700, fontSize: 38, lineHeight: 1.4, color: bn.soft }}>
          21 meses de Wi-Fi inteligente pagando 18.
          <br />
          Válida até <span style={{ color: bn.white }}>30 de novembro</span>.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 1400,
          opacity: cta,
          transform: `scale(${interpolate(cta, [0, 1], [0.8, 1])})`,
          transformOrigin: "left center",
        }}
      >
        <CtaPill>Pegar meu cupom</CtaPill>
      </div>
    </AbsoluteFill>
  );
};

export const BlackNovemberVideo: React.FC = () => {
  const musicVol = (f: number) =>
    interpolate(
      f,
      [0, 10, talkFrames - 8, talkFrames + 4, totalDurationInFrames - 18, totalDurationInFrames],
      [0, 0.075, 0.075, 0.28, 0.28, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  return (
    <AbsoluteFill style={{ background: bn.ink }}>
      <Audio src={staticFile("audio/funky-startup.mp3")} volume={musicVol} />
      {timeline.map(({ take, from, durationInFrames }, i) => (
        <Sequence key={take.id} from={from} durationInFrames={durationInFrames}>
          <TakeView take={take} durationInFrames={durationInFrames} index={i} />
          {i > 0 && <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.18} />}
        </Sequence>
      ))}
      {/* pops on the main graphic beats */}
      {[
        s(1.25),
        s(4.78),
        timeline[1].from + s(0.1),
        timeline[2].from + s(0.92),
        timeline[2].from + s(1.84),
        timeline[2].from + s(2.38),
        timeline[2].from + s(3.5),
        timeline[3].from + s(2.37),
        talkFrames + s(0.75),
      ].map((f) => (
        <Sequence key={f} from={f} durationInFrames={20}>
          <Audio src={staticFile("audio/sfx/pop.wav")} volume={0.22} />
        </Sequence>
      ))}
      <Sequence from={talkFrames} durationInFrames={END_FRAMES}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

export const BlackNovemberComposition = () => (
  <Composition
    id="BlackNovember"
    component={BlackNovemberVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
