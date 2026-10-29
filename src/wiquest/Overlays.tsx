import { Img, interpolate, spring, staticFile } from "remotion";
import type { IconKind } from "./edit";
import { Icon, Sfx, Stars, WifiArcs, usePop, wq, wsp } from "./theme";

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

// The hook: the question mark from the WiQuest logo bounces in beside her.
export const QuestionMark: React.FC<{ start: number; end: number }> = ({
  start,
  end,
}) => {
  const { enter, exit, visible, frame } = usePop(start, end, 8);
  if (!visible) return null;
  const local = frame - start;
  const bob = Math.sin(local / 7) * 10;
  const ring = interpolate(local, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <Sfx at={start} />
      <div
        style={{
          position: "absolute",
          top: 300,
          right: 90,
          width: 230,
          height: 230,
          transform: `translateY(${bob}px) scale(${enter * exit}) rotate(${interpolate(enter, [0, 1], [-30, 10])}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -30 * ring,
            borderRadius: "50%",
            border: `6px solid ${wq.orange}`,
            opacity: 1 - ring,
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: wq.orange,
            display: "grid",
            placeItems: "center",
            boxShadow: "0 20px 50px rgba(243,106,5,0.45)",
            color: wsp.white,
            fontFamily: wsp.font,
            fontWeight: 800,
            fontSize: 170,
            lineHeight: 1,
          }}
        >
          ?
        </div>
      </div>
    </>
  );
};

export const Sticker: React.FC<{
  text: string;
  icon: IconKind;
  start: number;
  end: number;
}> = ({ text, icon, start, end }) => {
  const { enter, exit, visible, frame } = usePop(start, end);
  if (!visible) return null;
  const iconIn = spring({ frame: frame - start - 4, fps: 30, config: { damping: 8 } });
  return (
    <>
      <Sfx at={start} />
      <div style={box(1250)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            background: wsp.white,
            borderRadius: 999,
            padding: "16px 44px 16px 16px",
            boxShadow: wq.shadow,
            transform: `scale(${enter * exit}) rotate(${interpolate(enter, [0, 1], [-6, -1.5])}deg)`,
          }}
        >
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              background: wq.orange,
              display: "grid",
              placeItems: "center",
              transform: `scale(${iconIn}) rotate(${interpolate(iconIn, [0, 1], [-90, 0])}deg)`,
            }}
          >
            <Icon kind={icon} size={52} />
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: text.length > 18 ? 48 : 56,
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

// White card with the WiQuest logo and a tagline pill underneath.
export const LogoCard: React.FC<{ start: number; end: number; tagline?: string }> = ({
  start,
  end,
  tagline,
}) => {
  const { enter, exit, visible, frame } = usePop(start, end, 10);
  if (!visible) return null;
  const sub = spring({ frame: frame - start - 10, fps: 30, config: { damping: 12 } });
  return (
    <>
      <Sfx at={start} volume={0.45} />
      <div style={box(1180)}>
        <div
          style={{
            background: wsp.white,
            borderRadius: 44,
            padding: "40px 64px 34px",
            boxShadow: wq.shadow,
            transform: `scale(${enter * exit}) rotate(${interpolate(enter, [0, 1], [8, 0])}deg)`,
          }}
        >
          <Img src={staticFile(wq.logoOrange)} style={{ width: 520, display: "block" }} />
        </div>
        {tagline ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: wsp.grad,
              color: wsp.white,
              fontWeight: 800,
              fontSize: 44,
              padding: "14px 36px 14px 24px",
              borderRadius: 999,
              boxShadow: wq.shadow,
              opacity: frame >= start + 10 ? 1 : 0,
              transform: `translateY(${interpolate(sub, [0, 1], [80, 0])}px) scale(${exit})`,
            }}
          >
            <WifiArcs size={44} />
            {tagline}
          </div>
        ) : null}
      </div>
    </>
  );
};

// A bad review the owner only finds later; swiped away when WiQuest arrives.
export const ReviewCard: React.FC<{ start: number; end: number }> = ({
  start,
  end,
}) => {
  const { enter, visible, frame } = usePop(start, end + 14, 13);
  if (!visible) return null;
  const away = spring({ frame: frame - end, fps: 30, config: { damping: 200 } });
  const stars = interpolate(frame - start, [8, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <Sfx at={start} />
      <Sfx at={end} src="audio/sfx/whoosh.wav" volume={0.3} />
      <div style={box(1120)}>
        <div
          style={{
            width: 820,
            background: wsp.white,
            borderRadius: 36,
            padding: "30px 36px",
            boxShadow: wq.shadow,
            transform: `translateY(${interpolate(enter, [0, 1], [420, 0])}px) translateX(${away * 1300}px) rotate(${-3 + away * 25}deg)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: wsp.tint,
                color: wsp.blueDeep,
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 38,
              }}
            >
              C
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 36, color: wsp.gray }}>
                Cliente
              </div>
              <div style={{ fontWeight: 700, fontSize: 26, color: wsp.gray, opacity: 0.6 }}>
                Avaliação no Google · há 2 dias
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <Stars filled={stars} size={50} />
          </div>
          <div
            style={{
              marginTop: 16,
              fontWeight: 700,
              fontSize: 38,
              lineHeight: 1.3,
              color: wsp.gray,
            }}
          >
            “Demorei pra ser atendido e ninguém perguntou nada.”
          </div>
        </div>
      </div>
    </>
  );
};

export const Cta: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const { enter, exit, visible } = usePop(start, end, 12);
  if (!visible) return null;
  return (
    <>
      <Sfx at={start} />
      <div style={box(250)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            background: wsp.white,
            color: wsp.blueDeep,
            fontWeight: 800,
            fontSize: 50,
            padding: "16px 44px 16px 18px",
            borderRadius: 999,
            boxShadow: wq.shadow,
            transform: `translateY(${interpolate(enter, [0, 1], [-260, 0])}px) scale(${exit})`,
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: wsp.grad,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon kind="chat" size={42} />
          </div>
          Fale com a Wispot
        </div>
      </div>
    </>
  );
};

// "Wi-Fi gratuito" turns into "Nova experiência".
export const Flow: React.FC<{ start: number; to: number; end: number }> = ({
  start,
  to,
  end,
}) => {
  const { enter, exit, visible, frame } = usePop(start, end, 12);
  if (!visible) return null;
  const second = spring({ frame: frame - to, fps: 30, config: { damping: 11 } });
  const arrow = interpolate(frame, [to - 10, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pill = (bg: string, color: string): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 18,
    background: bg,
    color,
    fontWeight: 800,
    fontSize: 54,
    padding: "16px 44px 16px 18px",
    borderRadius: 999,
    boxShadow: wq.shadow,
  });
  const dot = (bg: string): React.CSSProperties => ({
    width: 84,
    height: 84,
    borderRadius: "50%",
    background: bg,
    display: "grid",
    placeItems: "center",
  });
  return (
    <>
      <Sfx at={start} />
      {frame >= to ? <Sfx at={to} volume={0.45} /> : null}
      <div style={{ ...box(1160), gap: 10 }}>
        <div
          style={{
            ...pill(wsp.white, wsp.gray),
            transform: `translateX(${interpolate(enter, [0, 1], [-700, 0])}px) rotate(-2deg) scale(${exit})`,
          }}
        >
          <div style={dot(wsp.grad)}>
            <Icon kind="wifi" size={48} />
          </div>
          Wi-Fi gratuito
        </div>
        <svg width="70" height="90" viewBox="0 0 24 30" style={{ opacity: exit }}>
          <path
            d="M12 2v24M4 18l8 8 8-8"
            fill="none"
            stroke={wsp.white}
            strokeWidth={3.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - arrow}
          />
        </svg>
        <div
          style={{
            ...pill(wq.orange, wsp.white),
            opacity: frame >= to ? 1 : 0,
            transform: `scale(${second * exit}) rotate(${interpolate(second, [0, 1], [8, 2])}deg)`,
          }}
        >
          <div style={dot(wsp.white)}>
            <Icon kind="sparkle" size={48} color={wq.orange} />
          </div>
          Nova experiência
        </div>
      </div>
    </>
  );
};
