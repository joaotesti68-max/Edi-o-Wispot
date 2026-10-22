import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Icon, type IconKind, clamp, pa, rand, usePop } from "./theme";

const text = (size: number): React.CSSProperties => ({
  fontFamily: pa.font,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1,
  color: pa.white,
  textTransform: "uppercase",
  letterSpacing: "-0.02em",
  textShadow: "0 6px 30px rgba(10,21,32,0.55)",
});

// A word that springs up at `start` (absolute frame).
export const Word: React.FC<{
  start: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start) return null;
  const s = spring({ frame: frame - start, fps, config: { damping: 11, mass: 0.6 } });
  return (
    <div
      style={{
        ...style,
        transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px) scale(${interpolate(s, [0, 1], [0.7, 1])})`,
        opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
      }}
    >
      {children}
    </div>
  );
};

// Persistent "URGENTE · Smart Sampa" bar with a progress line.
export const TopBar: React.FC<{ end: number }> = ({ end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const out = interpolate(frame, [end - 8, end], [1, 0], clamp);
  const blink = 0.35 + 0.65 * (Math.sin(frame / 4) > 0 ? 1 : 0.3);
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity: out,
        transform: `translateY(${interpolate(s, [0, 1], [-180, 0])}px)`,
        fontFamily: pa.font,
      }}
    >
      <div style={{ display: "flex", borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: pa.red,
            color: pa.white,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: "0.12em",
            padding: "14px 24px",
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: pa.white, opacity: blink }} />
          URGENTE
        </div>
        <div
          style={{
            background: "rgba(10,21,32,0.82)",
            color: pa.white,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.06em",
            padding: "14px 26px",
          }}
        >
          VAZAMENTO <span style={{ color: pa.cyan }}>SMART SAMPA</span>
        </div>
      </div>
      <div style={{ width: 600, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
        <div
          style={{
            width: `${interpolate(frame, [0, end], [0, 100], clamp)}%`,
            height: "100%",
            background: pa.cyan,
          }}
        />
      </div>
    </div>
  );
};

type PrintSpec = { src: string; x: number; y: number; rot: number; at: number };

// "A prefeitura de São Paulo admitiu um vazamento no Smart Sampa."
export const Hook: React.FC<{
  prefeitura: number;
  admitiu: number;
  vazamento: number;
  smart: number;
  end: number;
}> = ({ prefeitura, admitiu, vazamento, smart, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame >= end) return null;

  if (frame < vazamento) {
    return (
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 1290,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <Word start={prefeitura} style={text(96)}>
          A prefeitura
        </Word>
        <Word start={prefeitura + 8} style={text(96)}>
          de São Paulo
        </Word>
        <Word start={admitiu} style={{ ...text(104), background: pa.grad, padding: "10px 22px 14px", borderRadius: 14, marginTop: 8 }}>
          admitiu
        </Word>
      </div>
    );
  }

  const prints: PrintSpec[] = [
    { src: "smart/g1.jpg", x: -160, y: 60, rot: -8, at: vazamento },
    { src: "smart/jovempan.jpg", x: 160, y: 110, rot: 7, at: vazamento + 7 },
    { src: "smart/oglobo.jpg", x: 0, y: 160, rot: -2, at: vazamento + 14 },
  ];
  const dim = interpolate(frame, [vazamento, vazamento + 6], [0, 0.72], clamp);
  const slam = spring({ frame: frame - vazamento, fps, config: { damping: 9, mass: 0.6 } });
  const shake = frame - vazamento < 8 ? (rand(frame) - 0.5) * 30 : 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(10,21,32,${dim})` }} />
      {prints.map((p) => {
        const s = spring({ frame: frame - p.at, fps, config: { damping: 13, mass: 0.7 } });
        if (frame < p.at) return null;
        return (
          <Img
            key={p.src}
            src={staticFile(p.src)}
            style={{
              position: "absolute",
              left: 540 - 270 + p.x,
              top: 640 + p.y,
              width: 540,
              borderRadius: 18,
              boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
              transform: `translateY(${interpolate(s, [0, 1], [1300, 0])}px) rotate(${interpolate(s, [0, 1], [p.rot * 3, p.rot])}deg) scale(${1 + frame * 0.0008})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          transform: `translateX(${shake}px)`,
        }}
      >
        <div
          style={{
            ...text(132),
            background: pa.red,
            padding: "16px 34px 22px",
            borderRadius: 18,
            transform: `scale(${interpolate(slam, [0, 1], [1.8, 1])}) rotate(-2deg)`,
            boxShadow: "0 20px 60px rgba(255,59,69,0.45)",
          }}
        >
          Vazamento
        </div>
        <Word start={smart} style={text(80)}>
          no <span style={{ color: pa.cyan }}>Smart Sampa</span>
        </Word>
      </div>
    </AbsoluteFill>
  );
};

// "E o problema não foi um hacker." — the hacker card gets struck out.
export const NotAHacker: React.FC<{ start: number; strike: number; end: number }> = ({
  start,
  strike,
  end,
}) => {
  const { enter, exit, visible, frame } = usePop(start, end, 10);
  if (!visible) return null;
  const line = interpolate(frame, [strike, strike + 6], [0, 1], clamp);
  const stamp = spring({ frame: frame - strike - 3, fps: 30, config: { damping: 9 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 1240,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${enter * exit})`,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 30,
          background: "rgba(10,21,32,0.85)",
          border: `4px solid ${line > 0 ? pa.red : pa.cyan}`,
          borderRadius: 28,
          padding: "26px 50px 26px 30px",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: line > 0 ? pa.red : pa.grad,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon kind="hacker" size={100} strokeWidth={1.7} />
        </div>
        <div style={text(120)}>Hacker{line > 0 ? "" : "?"}</div>
        <div
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            height: 16,
            width: `${line * 94}%`,
            background: pa.red,
            borderRadius: 8,
            transform: "rotate(-4deg)",
            boxShadow: "0 0 30px rgba(255,59,69,0.7)",
          }}
        />
      </div>
      {frame >= strike + 3 ? (
        <div
          style={{
            ...text(70),
            marginTop: 26,
            color: pa.white,
            background: pa.red,
            padding: "12px 28px 16px",
            borderRadius: 14,
            transform: `scale(${interpolate(stamp, [0, 1], [2.2, 1])}) rotate(-5deg)`,
            opacity: interpolate(stamp, [0, 0.3], [0, 1], clamp),
          }}
        >
          Não foi
        </div>
      ) : null}
    </div>
  );
};

// Face-tracking HUD drawn in the take's own coordinates (inside its zoom).
export const FaceScan: React.FC<{ match: number }> = ({ match }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  // João leans a little to his right near the end of the take.
  const cx = interpolate(frame, [0, 140, 175], [600, 600, 560], clamp);
  const cy = 830;
  const w = 470 * interpolate(draw, [0, 1], [1.5, 1]);
  const h = 600 * interpolate(draw, [0, 1], [1.5, 1]);
  const color = frame >= match ? pa.cyan : pa.white;
  const scanY = ((frame * 14) % h) - h / 2;
  const corner = 70;
  const cornerStyle = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: corner,
    height: corner,
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
    ...pos,
  });
  const dots = [
    [-0.24, -0.08],
    [0.2, -0.08],
    [0, 0.08],
    [-0.15, 0.24],
    [0.15, 0.24],
    [0, 0.3],
    [-0.32, 0.05],
    [0.32, 0.05],
  ];
  const matched = frame >= match;
  const pct = Math.min(98, Math.round(interpolate(frame, [8, match], [12, 98], clamp)));
  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        opacity: draw,
        fontFamily: pa.font,
      }}
    >
      <div style={cornerStyle({ left: 0, top: 0, borderLeftWidth: 8, borderTopWidth: 8 })} />
      <div style={cornerStyle({ right: 0, top: 0, borderRightWidth: 8, borderTopWidth: 8 })} />
      <div style={cornerStyle({ left: 0, bottom: 0, borderLeftWidth: 8, borderBottomWidth: 8 })} />
      <div style={cornerStyle({ right: 0, bottom: 0, borderRightWidth: 8, borderBottomWidth: 8 })} />
      {!matched ? (
        <div
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            top: h / 2 + scanY,
            height: 4,
            background: pa.cyan,
            boxShadow: `0 0 24px 6px ${pa.cyan}`,
          }}
        />
      ) : null}
      {dots.map(([dx, dy], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: w / 2 + dx * w - 6,
            top: h / 2 + dy * h - 6,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: color,
            opacity: interpolate(frame, [6 + i * 2, 10 + i * 2], [0, 0.85], clamp),
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: -4,
          bottom: -82,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: matched ? pa.cyan : "rgba(10,21,32,0.8)",
          color: matched ? pa.ink : pa.white,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: "0.06em",
          padding: "12px 20px",
          borderRadius: 10,
          whiteSpace: "nowrap",
        }}
      >
        {matched ? `MATCH ${pct}% · JOÃO · PRO ADVANCED` : `ANALISANDO ROSTO… ${pct}%`}
      </div>
    </div>
  );
};

// Top-corner camera readout for the surveillance take.
export const CamLabel: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame >= end) return null;
  const sec = Math.floor((frame - start) / 30);
  return (
    <div
      style={{
        position: "absolute",
        top: 240,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "space-between",
        fontFamily: pa.font,
        fontWeight: 800,
        fontSize: 30,
        letterSpacing: "0.08em",
        color: pa.white,
        textShadow: "0 2px 10px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: pa.red,
            opacity: Math.sin(frame / 4) > 0 ? 1 : 0.25,
          }}
        />
        REC
      </div>
      <div>CAM 04.271 · SP · 00:00:0{sec}</div>
    </div>
  );
};

// A pill with icon and label, used for keywords along the talk.
export const Chip: React.FC<{
  start: number;
  end: number;
  icon: IconKind;
  label: React.ReactNode;
  top: number;
  tone?: "blue" | "red";
}> = ({ start, end, icon, label, top, tone = "blue" }) => {
  const { enter, exit, visible } = usePop(start, end, 11);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: pa.white,
          borderRadius: 999,
          padding: "14px 44px 14px 14px",
          boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
          transform: `scale(${enter * exit}) rotate(${interpolate(enter, [0, 1], [-8, -1.5])}deg)`,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: tone === "red" ? pa.red : pa.grad,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon kind={icon} size={52} strokeWidth={2.1} />
        </div>
        <div
          style={{
            fontFamily: pa.font,
            fontWeight: 800,
            fontSize: 50,
            color: pa.ink,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

// RGB slices and a shake for a few frames on hard hits.
export const glitchShake = (frame: number, hits: number[]) => {
  const hit = hits.find((h) => frame >= h && frame < h + 6);
  if (hit === undefined) return { x: 0, y: 0 };
  return { x: (rand(frame * 3.1) - 0.5) * 50, y: (rand(frame * 7.7) - 0.5) * 24 };
};

export const GlitchBars: React.FC<{ hits: number[] }> = ({ hits }) => {
  const frame = useCurrentFrame();
  const hit = hits.find((h) => frame >= h && frame < h + 6);
  if (hit === undefined) return null;
  const bars = Array.from({ length: 9 }, (_, i) => {
    const r = (k: number) => rand(frame * 13.3 + i * 5.1 + k);
    return {
      top: r(1) * 1920,
      height: 10 + r(2) * 90,
      left: (r(3) - 0.5) * 300,
      color: [pa.red, pa.cyan, pa.white][i % 3],
      opacity: 0.35 + r(4) * 0.5,
    };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {bars.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: b.top,
            left: b.left,
            width: 1080,
            height: b.height,
            background: b.color,
            opacity: b.opacity,
            mixBlendMode: "difference",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Two-frame white flash on a cut.
export const Flash: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const hit = at.find((a) => frame >= a && frame < a + 4);
  if (hit === undefined) return null;
  return (
    <AbsoluteFill
      style={{ background: pa.white, opacity: interpolate(frame - hit, [0, 4], [0.7, 0]) }}
    />
  );
};
