import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "./edit";
import { toSceneFrame } from "./edit";
import { Headline, MgShell } from "./MgShell";
import { Sfx } from "./Overlays";
import type { IconKind } from "./theme";
import { Icon, pa } from "./theme";

const CX = 540;
const CY = 930;
const R = 360;
const NODE = 150;
const INFECTED = 1;

const NODES: IconKind[] = ["laptop", "phone", "desktop", "laptop", "tablet", "desktop"];
const pos = (i: number) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R };
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// "E se algo suspeito aparecer, agir rápido e isolar o equipamento antes
// que o problema se espalhe pela rede."
const Network: React.FC<{
  suspect: number;
  act: number;
  isolate: number;
  spread: number;
  safe: number;
}> = ({ suspect, act, isolate, spread, safe }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bad = pos(INFECTED);
  const cut = interpolate(frame, [isolate, isolate + 10], [0, 1], clamp);
  const wave = interpolate(frame, [act, act + 16], [0, 1], clamp);
  const ring = spring({ frame: frame - isolate, fps, config: { damping: 11 } });

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {NODES.map((_, i) => {
          const p = pos(i);
          const isBad = i === INFECTED;
          const draw = interpolate(frame, [6 + i * 3, 20 + i * 3], [0, 1], clamp);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={CX + (p.x - CX) * draw}
              y2={CY + (p.y - CY) * draw}
              stroke={pa.white}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={isBad && cut > 0 ? "14 18" : undefined}
              opacity={isBad ? 0.7 * (1 - cut) + 0.15 * cut : 0.55}
            />
          );
        })}
        {/* Healthy traffic: packets running out from the hub. */}
        {NODES.map((_, i) => {
          if (i === INFECTED && frame >= suspect) return null;
          const p = pos(i);
          const t = ((frame + i * 9) % 36) / 36;
          return (
            <circle
              key={`pk${i}`}
              cx={CX + (p.x - CX) * t}
              cy={CY + (p.y - CY) * t}
              r={9}
              fill={pa.white}
              opacity={frame > 24 ? 0.9 : 0}
            />
          );
        })}
        {/* The threat heads for the hub until the link is cut… */}
        {frame >= suspect && frame < isolate
          ? [0, 12, 24].map((o) => {
              const t = ((frame - suspect + o) % 36) / 36;
              return (
                <circle
                  key={`bad${o}`}
                  cx={bad.x + (CX - bad.x) * t * 0.85}
                  cy={bad.y + (CY - bad.y) * t * 0.85}
                  r={13}
                  fill={pa.deep}
                  stroke={pa.white}
                  strokeWidth={3}
                />
              );
            })
          : null}
        {/* …then every attempt to spread bounces off the isolation ring. */}
        {frame >= spread
          ? [0, 60, 120, 180, 240, 300].map((deg, k) => {
              const t = ((frame - spread + k * 5) % 24) / 24;
              const d = 20 + t * 110;
              const a = (deg * Math.PI) / 180;
              return (
                <circle
                  key={`sp${deg}`}
                  cx={bad.x + Math.cos(a) * d}
                  cy={bad.y + Math.sin(a) * d}
                  r={10}
                  fill={pa.deep}
                  stroke={pa.white}
                  strokeWidth={2}
                  opacity={1 - t}
                />
              );
            })
          : null}
        {/* Response wave from the hub to the suspicious device. */}
        {wave > 0 && wave < 1 ? (
          <circle
            cx={CX}
            cy={CY}
            r={60 + wave * R}
            fill="none"
            stroke={pa.white}
            strokeWidth={10 * (1 - wave) + 2}
            opacity={1 - wave * 0.6}
          />
        ) : null}
        {/* Isolation ring, drawn in the dashed rays of the logo mark. */}
        {frame >= isolate ? (
          <circle
            cx={bad.x}
            cy={bad.y}
            r={130 * ring}
            fill="rgba(255,255,255,0.12)"
            stroke={pa.white}
            strokeWidth={8}
            strokeDasharray="26 16"
            strokeLinecap="round"
            transform={`rotate(${frame * 2} ${bad.x} ${bad.y})`}
          />
        ) : null}
      </svg>

      {/* Cut mark on the severed link. */}
      {frame >= isolate ? (
        <div
          style={{
            position: "absolute",
            left: (CX + bad.x) / 2 - 38,
            top: (CY + bad.y) / 2 - 38,
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: pa.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${spring({ frame: frame - isolate - 4, fps, config: { damping: 9 } })})`,
          }}
        >
          <Icon kind="x" size={46} color={pa.deep} strokeWidth={3} />
        </div>
      ) : null}

      {NODES.map((icon, i) => {
        const p = pos(i);
        const s = spring({ frame: frame - 8 - i * 3, fps, config: { damping: 12 } });
        const isBad = i === INFECTED && frame >= suspect;
        const pulse = isBad && frame < isolate ? 1 + 0.07 * Math.sin((frame - suspect) / 2.5) : 1;
        const ok = !isBad && frame >= safe;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x - NODE / 2,
              top: p.y - NODE / 2,
              width: NODE,
              height: NODE,
              borderRadius: 36,
              background: isBad ? pa.deep : pa.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${s * pulse})`,
              boxShadow: isBad
                ? `0 0 0 ${frame < isolate ? 10 + 8 * Math.sin(frame / 3) : 0}px rgba(255,255,255,0.35)`
                : "0 14px 34px rgba(28,63,87,0.3)",
            }}
          >
            <Icon kind={icon} size={84} color={isBad ? pa.white : pa.blue} />
            {isBad ? (
              <div
                style={{
                  position: "absolute",
                  right: -24,
                  top: -24,
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: frame >= isolate ? pa.white : pa.light,
                  border: `4px solid ${pa.white}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  kind={frame >= isolate ? "lock" : "alert"}
                  size={40}
                  color={frame >= isolate ? pa.deep : pa.white}
                  strokeWidth={2.4}
                />
              </div>
            ) : null}
            {ok ? (
              <div
                style={{
                  position: "absolute",
                  right: -18,
                  top: -18,
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: pa.light,
                  border: `4px solid ${pa.white}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${spring({ frame: frame - safe - i * 2, fps, config: { damping: 9 } })})`,
                }}
              >
                <Icon kind="check" size={34} strokeWidth={3.2} />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Company hub. */}
      <div
        style={{
          position: "absolute",
          left: CX - 110,
          top: CY - 110,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: pa.white,
          border: `8px solid ${pa.light}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${spring({ frame: frame - 2, fps, config: { damping: 11 } })})`,
          boxShadow: "0 24px 60px rgba(28,63,87,0.35)",
        }}
      >
        <Icon kind={frame >= act ? "shield" : "server"} size={92} color={pa.blue} />
        <div style={{ fontFamily: pa.font, fontWeight: 800, fontSize: 24, color: pa.deep }}>
          REDE
        </div>
      </div>

      <Sfx at={suspect} volume={0.35} />
      <Sfx at={act} src="audio/sfx/whoosh.wav" volume={0.3} />
      <Sfx at={isolate} volume={0.4} />
      <Sfx at={safe} volume={0.3} />
    </AbsoluteFill>
  );
};

export const MgIsolate: React.FC<{ scene: Scene }> = ({ scene }) => {
  const f = (at: number) => toSceneFrame(scene, at);
  const suspect = f(1.9);
  const act = f(3.6);
  const isolate = f(4.75);
  const spread = f(5.8);
  const safe = f(7.0);
  return (
    <MgShell scene={scene}>
      <Headline
        lines={[
          { from: 4, small: "E SE APARECER", text: "ALGO SUSPEITO?" },
          { from: act, small: "PASSO 1", text: "AGIR RÁPIDO" },
          { from: isolate, small: "PASSO 2", text: "ISOLAR A MÁQUINA" },
          { from: safe, small: "AMEAÇA CONTIDA", text: "REDE PROTEGIDA" },
        ]}
      />
      <Network suspect={suspect} act={act} isolate={isolate} spread={spread} safe={safe} />
    </MgShell>
  );
};
