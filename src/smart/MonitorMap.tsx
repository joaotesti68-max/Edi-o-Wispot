import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SP_H, SP_W, spCameras, spCenters, spDistricts, spOutline } from "./spMap";
import { Icon, clamp, pa } from "./theme";

const MAP = { left: 60, top: 250, width: 960 };
const K = MAP.width / SP_W;
// Map units → screen pixels.
const toScreen = ([x, y]: [number, number]) => [MAP.left + x * K, MAP.top + y * K] as const;

// Cameras that sweep a field of view, and the ones that "recognise" a face.
const CONES = [0, 7, 19, 33, 58, 91, 120, 150];
const MATCHES: { district: string; side: "left" | "right"; id: string }[] = [
  { district: "PINHEIROS", side: "left", id: "#4821" },
  { district: "PENHA", side: "right", id: "#0377" },
  { district: "JABAQUARA", side: "left", id: "#9154" },
];

// Smart Sampa control-room map: the city draws in, cameras light up from
// the centre outwards, faces get matched, then the pin drops on São Paulo.
export const MonitorMap: React.FC<{
  start: number;
  end: number;
  title: number;
  monitoring: number;
  faces: number;
  city: number;
}> = ({ start, end, title, monitoring, faces, city }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start || frame >= end) return null;
  const f = frame - start;

  const reveal = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
  const outline = interpolate(f, [2, 30], [0, 1], clamp);
  const camStart = start + 8;
  const camEnd = monitoring + 20;
  const lit = Math.floor(interpolate(frame, [camStart, camEnd], [0, spCameras.length], clamp));
  const count = Math.round(interpolate(frame, [camStart, end - 6], [0, 50000], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 2,
  }));
  const titleIn = spring({ frame: frame - title, fps, config: { damping: 14 } });
  const [sx, sy] = toScreen(spCenters.SE);
  const pin = spring({ frame: frame - city, fps, config: { damping: 9, mass: 0.6 } });

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${reveal * 150}% at 50% 45%)`,
        fontFamily: pa.font,
      }}
    >
      <AbsoluteFill style={{ background: pa.ink }} />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(54,150,205,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(54,150,205,0.1) 2px, transparent 2px)",
          backgroundSize: "60px 60px",
          backgroundPosition: `0 ${(f * 0.8) % 60}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${sx}px ${sy}px, rgba(32,163,214,0.28) 0%, transparent 45%)`,
        }}
      />

      <svg
        width={MAP.width}
        height={SP_H * K}
        viewBox={`0 0 ${SP_W} ${SP_H}`}
        style={{
          position: "absolute",
          left: MAP.left,
          top: MAP.top,
          overflow: "visible",
          transform: `scale(${interpolate(f, [0, end - start], [1.06, 1])})`,
          transformOrigin: `${sx - MAP.left}px ${sy - MAP.top}px`,
        }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {spDistricts.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="rgba(54,150,205,0.1)"
            stroke="rgba(32,163,214,0.45)"
            strokeWidth={1.6}
            opacity={interpolate(f, [6 + (i % 24), 16 + (i % 24)], [0, 1], clamp)}
          />
        ))}
        <path
          d={spOutline}
          fill="none"
          stroke={pa.cyan}
          strokeWidth={5}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - outline}
          filter="url(#glow)"
        />

        {/* radar sweep from the centre */}
        <g transform={`translate(${spCenters.SE[0]} ${spCenters.SE[1]}) rotate(${f * 5})`}>
          <path d="M0 0 L900 0 A900 900 0 0 1 779 450 Z" fill="url(#sweep)" opacity={0.5} />
        </g>
        <defs>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0" stopColor={pa.cyan} stopOpacity={0.45} />
            <stop offset="1" stopColor={pa.cyan} stopOpacity={0} />
          </linearGradient>
        </defs>

        {CONES.map((ci) => {
          if (ci >= lit) return null;
          const [x, y] = spCameras[ci];
          const a = Math.sin((f + ci * 7) / 14) * 35 + ci * 47;
          return (
            <path
              key={`c${ci}`}
              d="M0 0 L70 -28 A76 76 0 0 1 70 28 Z"
              transform={`translate(${x} ${y}) rotate(${a})`}
              fill="rgba(32,163,214,0.3)"
            />
          );
        })}
        {spCameras.slice(0, lit).map(([x, y], i) => {
          const born = camStart + (i / spCameras.length) * (camEnd - camStart);
          const age = frame - born;
          const ring = interpolate(age, [0, 14], [0, 1], clamp);
          return (
            <g key={i}>
              {ring < 1 ? (
                <circle cx={x} cy={y} r={6 + ring * 26} fill="none" stroke={pa.cyan} strokeWidth={3} opacity={1 - ring} />
              ) : null}
              <circle cx={x} cy={y} r={6.5} fill={pa.white} />
              <circle cx={x} cy={y} r={11} fill="none" stroke={pa.cyan} strokeWidth={2.5} opacity={0.8} />
            </g>
          );
        })}
      </svg>

      {/* face matches */}
      {MATCHES.map((m, i) => {
        const t = faces + i * 6;
        if (frame < t) return null;
        const s = spring({ frame: frame - t, fps, config: { damping: 12 } });
        const [x, y] = toScreen(spCenters[m.district]);
        const boxX = m.side === "left" ? Math.max(24, x - 330) : x + 50;
        return (
          <div key={m.district}>
            <div
              style={{
                position: "absolute",
                left: x - 30,
                top: y - 30,
                width: 60,
                height: 60,
                border: `4px solid ${pa.red}`,
                borderRadius: 8,
                transform: `scale(${interpolate(s, [0, 1], [3, 1])})`,
                opacity: s,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: boxX,
                top: y - 46,
                width: 280,
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "rgba(10,21,32,0.92)",
                border: `3px solid ${pa.red}`,
                borderRadius: 14,
                padding: "12px 16px",
                transform: `scale(${s})`,
                transformOrigin: m.side === "left" ? "100% 50%" : "0% 50%",
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 10, background: pa.red, display: "grid", placeItems: "center" }}>
                <Icon kind="face" size={44} strokeWidth={2.2} />
              </div>
              <div style={{ color: pa.white, fontWeight: 800, fontSize: 24, lineHeight: 1.2, letterSpacing: "0.04em" }}>
                ROSTO IDENTIFICADO
                <div style={{ color: pa.cyan, fontSize: 22 }}>ID {m.id} · 97%</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* pin on the centre */}
      {frame >= city ? (
        <div
          style={{
            position: "absolute",
            left: sx - 200,
            top: sy - 230,
            width: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${interpolate(pin, [0, 1], [-300, 0])}px)`,
            opacity: Math.min(1, pin * 2),
          }}
        >
          <div
            style={{
              background: pa.white,
              color: pa.ink,
              fontWeight: 800,
              fontSize: 54,
              padding: "10px 30px 14px",
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            SÃO PAULO
          </div>
          <Icon kind="pin" size={120} color={pa.red} strokeWidth={2.4} />
        </div>
      ) : null}

      {/* header */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [-60, 0])}px)`,
        }}
      >
        <div>
          <div style={{ color: pa.cyan, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em" }}>
            CENTRAL DE MONITORAMENTO
          </div>
          <div style={{ color: pa.white, fontWeight: 800, fontSize: 76, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            SMART SAMPA
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 10,
              color: pa.white,
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: "0.12em",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: pa.red, opacity: Math.sin(f / 4) > 0 ? 1 : 0.3 }} />
            CÂMERAS ONLINE
          </div>
          <div style={{ color: pa.white, fontWeight: 800, fontSize: 64, fontVariantNumeric: "tabular-nums" }}>
            {count.toLocaleString("pt-BR")}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
