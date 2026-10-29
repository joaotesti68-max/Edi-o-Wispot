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
import type { IconKind } from "./theme";
import { Icon, pa } from "./theme";

const OUT = 8;

// Spring in at `start`, quick scale-out ending at `end`.
export const usePop = (start: number, end: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - start, fps, config: { damping, mass: 0.7 } });
  const exit = interpolate(frame, [end - OUT, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { enter, exit, visible: frame >= start && frame < end, frame, fps };
};

export const Sfx: React.FC<{ at: number; src?: string; volume?: number }> = ({
  at,
  src = "audio/sfx/pop.wav",
  volume = 0.3,
}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={18} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

const row = (top: number): React.CSSProperties => ({
  position: "absolute",
  top,
  left: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 18,
  fontFamily: pa.font,
});

// Pill with an icon badge. Dark pills mark threats, white ones the rest.
export const Sticker: React.FC<{
  text: string;
  icon: IconKind;
  start: number;
  end: number;
  dark?: boolean;
}> = ({ text, icon, start, end, dark }) => {
  const { enter, exit, visible, frame, fps } = usePop(start, end);
  if (!visible) return null;
  const iconIn = spring({ frame: frame - start - 4, fps, config: { damping: 8 } });
  return (
    <>
      <Sfx at={start} />
      <div style={row(1170)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            background: dark ? pa.deep : pa.white,
            borderRadius: 999,
            padding: "14px 44px 14px 14px",
            boxShadow: "0 18px 50px rgba(28,63,87,0.35)",
            transform: `scale(${enter * exit}) rotate(${interpolate(enter, [0, 1], [-6, -1.5])}deg)`,
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: pa.grad,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${iconIn})`,
            }}
          >
            <Icon kind={icon} size={52} />
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 46,
              color: dark ? pa.white : pa.deep,
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        </div>
      </div>
    </>
  );
};

// "do café, de casa, no escritório": three tiles side by side.
export const Places: React.FC<{
  items: { text: string; icon: IconKind; start: number }[];
  end: number;
}> = ({ items, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < items[0].start || frame >= end) return null;
  const exit = interpolate(frame, [end - OUT, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 1080,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 26,
        fontFamily: pa.font,
      }}
    >
      {items.map((it) => {
        const s = spring({ frame: frame - it.start, fps, config: { damping: 10, mass: 0.7 } });
        return (
          <div
            key={it.text}
            style={{
              width: 270,
              height: 250,
              borderRadius: 34,
              background: pa.white,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              boxShadow: "0 18px 50px rgba(28,63,87,0.3)",
              transform: `translateY(${interpolate(s, [0, 1], [80, 0])}px) scale(${s * exit})`,
              opacity: frame >= it.start ? 1 : 0,
            }}
          >
            <Sfx at={it.start} />
            <div
              style={{
                width: 112,
                height: 112,
                borderRadius: 30,
                background: pa.grad,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon kind={it.icon} size={66} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 38, color: pa.deep }}>{it.text}</span>
          </div>
        );
      })}
    </div>
  );
};

const DEVICES: IconKind[] = ["laptop", "phone", "desktop", "tablet"];

// Definition card: every device that reaches the company's systems is an
// endpoint. Devices pop first, the word lands with the speaker.
export const EndpointCard: React.FC<{ start: number; reveal: number; end: number }> = ({
  start,
  reveal,
  end,
}) => {
  const { enter, exit, visible, frame, fps } = usePop(start, end, 15);
  if (!visible) return null;
  const word = spring({ frame: frame - reveal, fps, config: { damping: 9 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 940,
        left: 70,
        right: 70,
        borderRadius: 40,
        background: pa.white,
        padding: "40px 40px 44px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
        fontFamily: pa.font,
        boxShadow: "0 24px 60px rgba(28,63,87,0.35)",
        transform: `translateY(${interpolate(enter, [0, 1], [140, 0])}px) scale(${exit})`,
        opacity: enter,
      }}
    >
      <div style={{ display: "flex", gap: 30 }}>
        {DEVICES.map((d, i) => {
          const s = spring({ frame: frame - start - 6 - i * 7, fps, config: { damping: 9 } });
          const glow = frame >= reveal ? 0.5 + 0.5 * Math.sin((frame - reveal) / 5 + i) : 0;
          return (
            <div
              key={d}
              style={{
                width: 150,
                height: 150,
                borderRadius: 32,
                background: pa.grad,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${s})`,
                boxShadow: `0 0 ${glow * 40}px rgba(32,163,214,${glow * 0.8})`,
              }}
            >
              <Icon kind={d} size={84} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 38,
          color: pa.gray,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Todo dispositivo que acessa
        <br />
        os sistemas da empresa é um
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: "0.04em",
          color: pa.blue,
          transform: `scale(${interpolate(word, [0, 1], [0.3, 1])})`,
          opacity: frame >= reveal ? 1 : 0,
        }}
      >
        ENDPOINT
      </div>
      <Sfx at={start} src="audio/sfx/whoosh.wav" volume={0.25} />
      <Sfx at={reveal} volume={0.4} />
    </div>
  );
};

// The three ways one laptop puts the company at risk, stacking up.
export const Risks: React.FC<{
  items: { text: string; icon: IconKind; start: number }[];
  end: number;
}> = ({ items, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < items[0].start || frame >= end) return null;
  const exit = interpolate(frame, [end - OUT, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 960,
        left: 90,
        right: 90,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        fontFamily: pa.font,
        opacity: exit,
      }}
    >
      {items.map((it, i) => {
        const s = spring({ frame: frame - it.start, fps, config: { damping: 13 } });
        if (frame < it.start) return null;
        return (
          <div
            key={it.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: pa.white,
              borderRadius: 28,
              padding: "16px 30px 16px 16px",
              boxShadow: "0 14px 40px rgba(28,63,87,0.3)",
              transform: `translateX(${interpolate(s, [0, 1], [i % 2 ? 700 : -700, 0])}px)`,
            }}
          >
            <Sfx at={it.start} src="audio/sfx/whoosh.wav" volume={0.2} />
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 22,
                background: pa.deep,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon kind={it.icon} size={50} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 40, color: pa.deep, flex: 1 }}>
              {it.text}
            </span>
            <Icon kind="alert" size={50} color={pa.blue} strokeWidth={2.4} />
          </div>
        );
      })}
    </div>
  );
};

// "toda a sua operação e o seu cliente em risco"
export const RiskBanner: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const { enter, exit, visible, frame } = usePop(start, end, 10);
  if (!visible) return null;
  const shake = frame - start < 14 ? Math.sin((frame - start) * 2.4) * (14 - (frame - start)) : 0;
  return (
    <div style={row(1030)}>
      <Sfx at={start} src="audio/sfx/whoosh.wav" volume={0.3} />
      <div
        style={{
          background: pa.deep,
          borderRadius: 36,
          padding: "34px 54px",
          display: "flex",
          alignItems: "center",
          gap: 30,
          boxShadow: "0 24px 60px rgba(28,63,87,0.45)",
          transform: `translateX(${shake}px) scale(${enter * exit})`,
          border: `4px solid ${pa.light}`,
        }}
      >
        <Icon kind="alert" size={110} color={pa.light} strokeWidth={2.2} />
        <div style={{ fontWeight: 800, color: pa.white, lineHeight: 1.1 }}>
          <div style={{ fontSize: 44, color: pa.light }}>OPERAÇÃO E CLIENTES</div>
          <div style={{ fontSize: 84 }}>EM RISCO</div>
        </div>
      </div>
    </div>
  );
};

// "Fale com a gente pelo link."
export const Cta: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const { enter, visible, frame, fps } = usePop(start, end + 30, 10);
  if (!visible) return null;
  const tap = spring({ frame: frame - start - 14, fps, config: { damping: 7 } });
  const press = 1 - 0.06 * Math.max(0, Math.sin((frame - start - 14) / 4)) * (frame > start + 14 ? 1 : 0);
  return (
    <div style={row(1130)}>
      <Sfx at={start} />
      <div
        style={{
          position: "relative",
          background: pa.grad,
          borderRadius: 999,
          padding: "30px 64px",
          display: "flex",
          alignItems: "center",
          gap: 22,
          boxShadow: "0 22px 60px rgba(28,63,87,0.4)",
          transform: `scale(${enter * press})`,
          border: `5px solid ${pa.white}`,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 54, color: pa.white }}>FALE COM A GENTE</span>
        <div
          style={{
            position: "absolute",
            right: -30,
            bottom: -86,
            transform: `scale(${tap}) rotate(-18deg)`,
          }}
        >
          <Icon kind="pointer" size={120} color={pa.white} strokeWidth={1.8} />
        </div>
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 38,
          color: pa.deep,
          background: pa.white,
          padding: "12px 34px",
          borderRadius: 999,
          opacity: tap,
          marginTop: 40,
        }}
      >
        Clique no link
      </div>
    </div>
  );
};

// Brand pill pinned to the top of the camera scenes.
export const LogoPill: React.FC<{ animateIn: boolean }> = ({ animateIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = animateIn ? spring({ frame: frame - 4, fps, config: { damping: 13 } }) : 1;
  return (
    <div
      style={{
        position: "absolute",
        top: 96,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${interpolate(s, [0, 1], [-220, 0])}px)`,
      }}
    >
      <div
        style={{
          background: pa.grad,
          borderRadius: 999,
          padding: "20px 44px",
          boxShadow: "0 12px 34px rgba(28,63,87,0.35)",
        }}
      >
        <Img src={staticFile(pa.logoWhite)} style={{ width: 330, display: "block" }} />
      </div>
    </div>
  );
};
