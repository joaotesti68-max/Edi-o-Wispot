import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "./edit";
import { toSceneFrame } from "./edit";
import { MgShell } from "./MgShell";
import { Sfx } from "./Overlays";
import type { IconKind } from "./theme";
import { Icon, pa } from "./theme";
import { ramp } from "./ui";

const CX = 540;
const CY = 920;
const R = 380;
const NODE = 156;
const BAD = 1;
// The infected device's links: to the hub and to its two neighbours.
const BAD_LINKS = [-1, 0, 2];
const BAD_ANGLE = -30;

const NODES: IconKind[] = ["laptop", "phone", "desktop", "laptop", "tablet", "desktop"];
const pos = (i: number) => {
  if (i < 0) return { x: CX, y: CY };
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R };
};

const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

// "E se algo suspeito aparecer, agir rápido e isolar o equipamento antes
// que o problema se espalhe pela rede." Acted out with no words: the threat
// creeps along the device's links, a radar sweep locks onto it, the links
// snap, a quarantine bubble closes around it and the rest of the network
// lights back up.
const Network: React.FC<{
  suspect: number;
  act: number;
  lock: number;
  isolate: number;
  safe: number;
}> = ({ suspect, act, lock, isolate, safe }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bad = pos(BAD);
  const infected = frame >= suspect;
  const isolated = frame >= isolate;
  const bubble = spring({ frame: frame - isolate, fps, config: { damping: 10 } });
  const snap = ramp(frame, isolate, isolate + 12);
  const creep = ramp(frame, suspect + 4, isolate, false) * 0.62;
  const healthy = frame >= safe;

  // Every other link: hub spokes plus the ring between neighbours.
  const links: [number, number][] = [
    ...NODES.map((_, i) => [-1, i] as [number, number]),
    ...NODES.map((_, i) => [i, (i + 1) % NODES.length] as [number, number]),
  ].filter(([a, b]) => !(a === BAD || b === BAD));

  // Radar sweep from the hub, from "agir rápido" until it locks on.
  const sweepDeg = interpolate(frame, [act, lock], [BAD_ANGLE - 540, BAD_ANGLE], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const radarFade = 1 - ramp(frame, isolate - 2, isolate + 6);
  const radarOn = frame >= act && frame < isolate + 6;
  const reticle = spring({ frame: frame - lock, fps, config: { damping: 12 } });
  const glitch = infected && !isolated ? Math.sin(frame * 3.1) * 6 : 0;
  const wave = ramp(frame, safe, safe + 26);

  return (
    <AbsoluteFill>
      {radarOn ? (
        <div
          style={{
            position: "absolute",
            left: CX - R - 140,
            top: CY - R - 140,
            width: (R + 140) * 2,
            height: (R + 140) * 2,
            borderRadius: "50%",
            background: `conic-gradient(from ${sweepDeg + 90 - 50}deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.32) 50deg, rgba(255,255,255,0) 51deg)`,
            opacity: radarFade,
          }}
        />
      ) : null}

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {radarOn
          ? [0.35, 0.7, 1].map((k) => (
              <circle
                key={k}
                cx={CX}
                cy={CY}
                r={(R + 140) * k}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={3}
                opacity={radarFade}
              />
            ))
          : null}

        {links.map(([a, b]) => {
          const p = pos(a);
          const q = pos(b);
          const draw = ramp(frame, 4 + (b + 1) * 2, 18 + (b + 1) * 2);
          const end = lerp(p, q, draw);
          return (
            <line
              key={`${a}-${b}`}
              x1={p.x}
              y1={p.y}
              x2={end.x}
              y2={end.y}
              stroke={pa.white}
              strokeWidth={a === -1 ? 6 : 4}
              strokeLinecap="round"
              opacity={a === -1 ? 0.55 : 0.3}
            />
          );
        })}

        {/* The infected device's links carry the threat, then snap. */}
        {BAD_LINKS.map((o) => {
          const p = pos(o);
          if (!isolated) {
            const end = lerp(bad, p, ramp(frame, 6, 20));
            return (
              <line
                key={`bad${o}`}
                x1={bad.x}
                y1={bad.y}
                x2={end.x}
                y2={end.y}
                stroke={infected ? pa.deep : pa.white}
                strokeWidth={o === -1 ? 7 : 5}
                strokeLinecap="round"
                opacity={infected ? 0.85 : o === -1 ? 0.55 : 0.3}
              />
            );
          }
          // Each half retracts to its own end with a burst at the cut.
          const mid = lerp(bad, p, 0.5);
          const a1 = lerp(mid, bad, snap);
          const b1 = lerp(mid, p, snap);
          return (
            <g key={`bad${o}`} opacity={1 - snap}>
              <line x1={bad.x} y1={bad.y} x2={a1.x} y2={a1.y} stroke={pa.deep} strokeWidth={6} strokeLinecap="round" />
              <line x1={p.x} y1={p.y} x2={b1.x} y2={b1.y} stroke={pa.white} strokeWidth={6} strokeLinecap="round" />
              {[0, 1, 2, 3, 4].map((k) => {
                const ang = (k / 5) * Math.PI * 2 + o;
                return (
                  <circle
                    key={k}
                    cx={mid.x + Math.cos(ang) * snap * 60}
                    cy={mid.y + Math.sin(ang) * snap * 60}
                    r={7 * (1 - snap) + 1}
                    fill={pa.white}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Healthy traffic, quicker once the network is safe again. */}
        {NODES.map((_, i) => {
          if (i === BAD && infected) return null;
          const speed = healthy ? 22 : 34;
          const t = ((frame + i * 9) % speed) / speed;
          const p = lerp(pos(-1), pos(i), t);
          return <circle key={`pk${i}`} cx={p.x} cy={p.y} r={9} fill={pa.white} opacity={frame > 22 ? 0.9 : 0} />;
        })}

        {/* The threat creeping out along every link of the infected device. */}
        {infected && !isolated
          ? BAD_LINKS.flatMap((o) =>
              [0, 0.33, 0.66].map((off) => {
                const t = (((frame - suspect) / 26 + off) % 1) * creep;
                const p = lerp(bad, pos(o), t);
                return (
                  <circle
                    key={`th${o}${off}`}
                    cx={p.x}
                    cy={p.y}
                    r={14}
                    fill={pa.deep}
                    stroke={pa.white}
                    strokeWidth={3}
                  />
                );
              }),
            )
          : null}

        {/* Inside the bubble the threat keeps hitting the wall and fizzles. */}
        {isolated
          ? [0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
              const t = ((frame - isolate + k * 4) % 22) / 22;
              const ang = (k * 47 * Math.PI) / 180;
              const d = 70 + t * 70;
              return (
                <circle
                  key={`in${k}`}
                  cx={bad.x + Math.cos(ang) * d}
                  cy={bad.y + Math.sin(ang) * d}
                  r={11 * (1 - t) + 2}
                  fill={pa.deep}
                  stroke={pa.white}
                  strokeWidth={2}
                  opacity={(1 - t) * bubble}
                />
              );
            })
          : null}

        {/* Quarantine bubble. */}
        {isolated ? (
          <g>
            <circle cx={bad.x} cy={bad.y} r={150 * bubble} fill="rgba(255,255,255,0.16)" />
            <circle
              cx={bad.x}
              cy={bad.y}
              r={150 * bubble}
              fill="none"
              stroke={pa.white}
              strokeWidth={9}
              strokeDasharray="30 16"
              strokeLinecap="round"
              transform={`rotate(${frame * 2.2} ${bad.x} ${bad.y})`}
            />
            <circle
              cx={bad.x}
              cy={bad.y}
              r={172 * bubble}
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={4}
              strokeDasharray="6 14"
              transform={`rotate(${-frame * 1.4} ${bad.x} ${bad.y})`}
            />
          </g>
        ) : null}

        {/* Recovery wave from the hub once the threat is contained. */}
        {wave > 0 && wave < 1 ? (
          <circle
            cx={CX}
            cy={CY}
            r={120 + wave * (R + 120)}
            fill="none"
            stroke={pa.white}
            strokeWidth={14 * (1 - wave) + 2}
            opacity={1 - wave}
          />
        ) : null}
      </svg>

      {/* Lock-on reticle. */}
      {frame >= lock && frame < isolate + 14 ? (
        <div
          style={{
            position: "absolute",
            left: bad.x - 130,
            top: bad.y - 130,
            width: 260,
            height: 260,
            transform: `scale(${interpolate(reticle, [0, 1], [1.8, 1])}) rotate(${interpolate(reticle, [0, 1], [45, 0])}deg)`,
            opacity: reticle * (1 - ramp(frame, isolate + 4, isolate + 14)),
          }}
        >
          {[0, 90, 180, 270].map((r) => (
            <div key={r} style={{ position: "absolute", inset: 0, transform: `rotate(${r}deg)` }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 60,
                  height: 60,
                  borderLeft: `9px solid ${pa.white}`,
                  borderTop: `9px solid ${pa.white}`,
                  borderTopLeftRadius: 16,
                }}
              />
            </div>
          ))}
        </div>
      ) : null}

      {NODES.map((icon, i) => {
        const p = pos(i);
        const s = spring({ frame: frame - 8 - i * 3, fps, config: { damping: 12 } });
        const isBad = i === BAD && infected;
        const shrink = isBad && isolated ? interpolate(bubble, [0, 1], [1, 0.82]) : 1;
        const pulse = isBad && !isolated ? 1 + 0.07 * Math.sin((frame - suspect) / 2.2) : 1;
        // Neighbours flicker while the threat creeps toward them.
        const threatened = (i === 0 || i === 2) && infected && !isolated && creep > 0.3;
        const litAt = safe + 4 + i * 2;
        const lit = !isBad && frame >= litAt;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x - NODE / 2 + (isBad ? glitch : 0),
              top: p.y - NODE / 2,
              width: NODE,
              height: NODE,
              borderRadius: 38,
              background: isBad ? pa.deep : pa.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${s * pulse * shrink})`,
              boxShadow: isBad
                ? `0 0 0 ${isolated ? 0 : 12 + 10 * Math.sin(frame / 2.5)}px rgba(28,63,87,0.35)`
                : lit
                  ? `0 0 0 ${14 * (1 - ramp(frame, litAt, litAt + 20))}px rgba(255,255,255,0.6), 0 14px 34px rgba(28,63,87,0.3)`
                  : "0 14px 34px rgba(28,63,87,0.3)",
              opacity: threatened ? 0.75 + 0.25 * Math.sin(frame * 1.7) : 1,
            }}
          >
            <Icon kind={icon} size={88} color={isBad ? pa.white : pa.blue} />
            {isBad ? (
              <div
                style={{
                  position: "absolute",
                  right: -26,
                  top: -26,
                  width: 74,
                  height: 74,
                  borderRadius: "50%",
                  background: isolated ? pa.white : pa.light,
                  border: `5px solid ${pa.white}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  kind={isolated ? "lock" : "bug"}
                  size={42}
                  color={isolated ? pa.deep : pa.white}
                  strokeWidth={2.4}
                />
              </div>
            ) : null}
            {lit ? (
              <div
                style={{
                  position: "absolute",
                  right: -20,
                  top: -20,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: pa.light,
                  border: `4px solid ${pa.white}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${spring({ frame: frame - litAt, fps, config: { damping: 9 } })})`,
                }}
              >
                <Icon kind="check" size={36} strokeWidth={3.2} />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Company hub: a server that turns into a shield when it reacts. */}
      <div
        style={{
          position: "absolute",
          left: CX - 120,
          top: CY - 120,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: pa.white,
          border: `10px solid ${pa.light}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${spring({ frame: frame - 2, fps, config: { damping: 11 } }) * (frame >= act && frame < act + 8 ? 1.08 : 1)})`,
          boxShadow: "0 24px 60px rgba(28,63,87,0.35)",
        }}
      >
        <Icon kind={frame >= act ? "shield" : "server"} size={120} color={pa.blue} />
      </div>

      <Sfx at={suspect} volume={0.35} />
      <Sfx at={act} src="audio/sfx/whoosh.wav" volume={0.3} />
      <Sfx at={lock} volume={0.3} />
      <Sfx at={isolate} src="audio/sfx/whoosh.wav" volume={0.35} />
      <Sfx at={safe} volume={0.3} />
    </AbsoluteFill>
  );
};

export const MgIsolate: React.FC<{ scene: Scene }> = ({ scene }) => {
  const f = (at: number) => toSceneFrame(scene, at);
  return (
    <MgShell scene={scene}>
      <Network suspect={f(2.6)} act={f(3.6)} lock={f(4.6)} isolate={f(4.85)} safe={f(7.0)} />
    </MgShell>
  );
};
