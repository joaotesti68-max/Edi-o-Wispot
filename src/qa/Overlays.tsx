import {
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { StickerKind } from "./edit";
import { Icon, WifiArcs, wsp } from "./theme";

const OUT = 8;

// Spring in at `start`, quick scale-out ending at `end`.
const usePop = (start: number, end: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - start, fps, config: { damping, mass: 0.7 } });
  const exit = interpolate(frame, [end - OUT, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { enter, exit, visible: frame >= start && frame < end, frame };
};

const Pop: React.FC<{ at: number; volume?: number }> = ({ at, volume = 0.35 }) => (
  <Sequence from={at} durationInFrames={6} layout="none">
    <Audio src={staticFile("audio/sfx/pop.wav")} volume={volume} />
  </Sequence>
);

const box = (top: number): React.CSSProperties => ({
  position: "absolute",
  top,
  left: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 18,
  fontFamily: wsp.font,
});

export const Sticker: React.FC<{
  text: string;
  icon: StickerKind;
  start: number;
  end: number;
}> = ({ text, icon, start, end }) => {
  const { enter, exit, visible, frame } = usePop(start, end);
  if (!visible) return null;
  const pulse = icon === "live" ? 0.55 + 0.45 * Math.abs(Math.sin(frame / 6)) : 1;
  const iconIn = spring({
    frame: frame - start - 4,
    fps: 30,
    config: { damping: 8 },
  });
  return (
    <>
      <Pop at={start} />
      <div style={box(1240)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            background: wsp.white,
            borderRadius: 999,
            padding: "16px 44px 16px 16px",
            boxShadow: "0 18px 50px rgba(11,145,193,0.35)",
            transform: `scale(${enter * exit}) rotate(${interpolate(enter, [0, 1], [-6, -1.5])}deg)`,
          }}
        >
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              background: wsp.grad,
              display: "grid",
              placeItems: "center",
              transform: `scale(${iconIn}) rotate(${interpolate(iconIn, [0, 1], [-90, 0])}deg)`,
              opacity: pulse,
            }}
          >
            <Icon kind={icon} size={52} />
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: text.length > 18 ? 46 : 56,
              color: wsp.gray,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </>
  );
};

export const NameTag: React.FC<{ start: number; end: number }> = ({
  start,
  end,
}) => {
  const { enter, exit, visible, frame } = usePop(start, end, 15);
  if (!visible) return null;
  const sub = spring({ frame: frame - start - 6, fps: 30, config: { damping: 15 } });
  return (
    <>
      <Pop at={start} />
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 1280,
          fontFamily: wsp.font,
          opacity: exit,
          transform: `translateX(${interpolate(enter, [0, 1], [-500, 0])}px)`,
        }}
      >
        <div
          style={{
            background: wsp.white,
            color: wsp.gray,
            fontWeight: 800,
            fontSize: 72,
            padding: "14px 40px",
            borderRadius: "22px 22px 22px 0",
            display: "inline-block",
          }}
        >
          Vanessa
        </div>
        <div
          style={{
            marginTop: 10,
            background: wsp.grad,
            color: wsp.white,
            fontWeight: 700,
            fontSize: 38,
            padding: "12px 30px",
            borderRadius: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            transform: `translateX(${interpolate(sub, [0, 1], [-420, 0])}px)`,
          }}
        >
          <WifiArcs size={40} />
          Time Wispot
        </div>
      </div>
    </>
  );
};

export const LogoPop: React.FC<{ start: number; end: number }> = ({
  start,
  end,
}) => {
  const { enter, exit, visible } = usePop(start, end, 10);
  if (!visible) return null;
  return (
    <>
      <Pop at={start} volume={0.45} />
      <div style={box(1220)}>
        <div
          style={{
            background: wsp.white,
            borderRadius: 40,
            padding: "36px 60px",
            boxShadow: "0 18px 50px rgba(11,145,193,0.35)",
            transform: `scale(${enter * exit}) rotate(${interpolate(enter, [0, 1], [8, 0])}deg)`,
          }}
        >
          <Img src={staticFile(wsp.logoBlue)} style={{ width: 460 }} />
        </div>
      </div>
    </>
  );
};

// A small animated dashboard: bars grow, a line draws, a KPI counts up.
export const Dashboard: React.FC<{ start: number; end: number }> = ({
  start,
  end,
}) => {
  const { enter, exit, visible, frame } = usePop(start, end, 14);
  if (!visible) return null;
  const local = frame - start;
  const grow = (i: number) =>
    spring({ frame: local - 8 - i * 3, fps: 30, config: { damping: 13 } });
  const line = interpolate(local, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const count = Math.round(
    interpolate(local, [8, 40], [0, 12480], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const bars = [0.45, 0.7, 0.55, 0.85, 0.65, 1];
  return (
    <>
      <Pop at={start} />
      <div style={box(1060)}>
        <div
          style={{
            width: 760,
            background: wsp.white,
            borderRadius: 36,
            padding: "30px 36px 34px",
            boxShadow: "0 22px 60px rgba(11,145,193,0.38)",
            transform: `translateY(${interpolate(enter, [0, 1], [380, 0])}px) scale(${exit})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 40, color: wsp.gray }}>
              Dashboard
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontWeight: 700,
                fontSize: 26,
                color: wsp.blueDeep,
                background: wsp.tint,
                padding: "8px 18px",
                borderRadius: 999,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: wsp.blue,
                  opacity: 0.4 + 0.6 * Math.abs(Math.sin(local / 6)),
                }}
              />
              ao vivo
            </div>
          </div>
          <div style={{ display: "flex", gap: 28, marginTop: 22 }}>
            <div style={{ flex: "0 0 230px" }}>
              <div style={{ fontWeight: 700, fontSize: 24, color: wsp.gray, opacity: 0.7 }}>
                Visitantes
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 58,
                  color: wsp.blueDeep,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {count.toLocaleString("pt-BR")}
              </div>
              <svg width="230" height="90" viewBox="0 0 230 90" style={{ marginTop: 8 }}>
                <path
                  d="M4 78 L40 60 L76 66 L112 38 L148 46 L184 20 L226 10"
                  fill="none"
                  stroke={wsp.blue}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - line}
                />
              </svg>
            </div>
            <div
              style={{
                flex: 1,
                height: 210,
                display: "flex",
                alignItems: "flex-end",
                gap: 14,
              }}
            >
              {bars.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h * 100 * grow(i)}%`,
                    borderRadius: 10,
                    background: i === bars.length - 1 ? wsp.grad : wsp.tint,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Chips: React.FC<{
  items: { text: string; icon: StickerKind; start: number }[];
  end: number;
}> = ({ items, end }) => {
  const frame = useCurrentFrame();
  if (frame < items[0].start || frame >= end) return null;
  const exit = interpolate(frame, [end - OUT, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ ...box(1060), gap: 22 }}>
      {items.map((item, i) => {
        const s = spring({
          frame: frame - item.start,
          fps: 30,
          config: { damping: 11, mass: 0.7 },
        });
        return (
          <div
            key={item.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              background: i % 2 === 0 ? wsp.white : wsp.grad,
              color: i % 2 === 0 ? wsp.gray : wsp.white,
              fontWeight: 800,
              fontSize: 56,
              padding: "16px 44px 16px 22px",
              borderRadius: 999,
              boxShadow: "0 16px 44px rgba(11,145,193,0.35)",
              opacity: frame >= item.start ? 1 : 0,
              transform: `translateX(${interpolate(s, [0, 1], [i % 2 === 0 ? -700 : 700, 0])}px) rotate(${(i - 1) * 2}deg) scale(${exit})`,
            }}
          >
            {frame >= item.start ? <Pop at={item.start} /> : null}
            <Icon
              kind={item.icon}
              size={58}
              color={i % 2 === 0 ? wsp.blue : wsp.white}
            />
            {item.text}
          </div>
        );
      })}
    </div>
  );
};

// A comment box that types out a question, for the "leave your question" CTA.
export const CommentBox: React.FC<{ start: number; end: number }> = ({
  start,
  end,
}) => {
  const { enter, exit, visible, frame } = usePop(start, end, 13);
  if (!visible) return null;
  const text = "Como a Wispot funciona no meu negócio?";
  const typed = Math.round(
    interpolate(frame - start, [12, 60], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const caret = Math.floor((frame - start) / 8) % 2 === 0;
  return (
    <>
      <Pop at={start} />
      <div style={box(1150)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: wsp.grad,
            color: wsp.white,
            fontWeight: 800,
            fontSize: 42,
            padding: "14px 32px 14px 22px",
            borderRadius: 999,
            transform: `scale(${enter * exit})`,
          }}
        >
          <Icon kind="chat" size={48} />
          Deixe sua dúvida
        </div>
        <div
          style={{
            width: 860,
            display: "flex",
            alignItems: "center",
            gap: 22,
            background: wsp.white,
            borderRadius: 34,
            padding: "26px 30px",
            boxShadow: "0 18px 50px rgba(11,145,193,0.35)",
            transform: `translateY(${interpolate(enter, [0, 1], [300, 0])}px) scale(${exit})`,
          }}
        >
          <div
            style={{
              flex: "0 0 74px",
              height: 74,
              borderRadius: "50%",
              background: wsp.tint,
              display: "grid",
              placeItems: "center",
            }}
          >
            <WifiArcs size={44} color={wsp.blue} />
          </div>
          <div
            style={{
              flex: 1,
              fontWeight: 700,
              fontSize: 36,
              lineHeight: 1.25,
              color: wsp.gray,
              minHeight: 90,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>
              {text.slice(0, typed)}
              <span style={{ color: wsp.blue, opacity: caret ? 1 : 0 }}>|</span>
            </span>
          </div>
          <div
            style={{
              flex: "0 0 74px",
              height: 74,
              borderRadius: "50%",
              background: typed === text.length ? wsp.grad : wsp.tint,
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={wsp.white} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export const NextEpisode: React.FC<{ start: number; end: number }> = ({
  start,
  end,
}) => {
  const { enter, exit, visible } = usePop(start, end, 11);
  if (!visible) return null;
  return (
    <>
      <Pop at={start} />
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          fontFamily: wsp.font,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            background: wsp.white,
            color: wsp.blueDeep,
            fontWeight: 800,
            fontSize: 42,
            padding: "14px 36px 14px 16px",
            borderRadius: 999,
            boxShadow: "0 14px 40px rgba(11,145,193,0.35)",
            transform: `translateY(${interpolate(enter, [0, 1], [-240, 0])}px) scale(${exit})`,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: wsp.grad,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon kind="play" size={34} />
          </div>
          Respondemos no próximo vídeo
        </div>
      </div>
    </>
  );
};
