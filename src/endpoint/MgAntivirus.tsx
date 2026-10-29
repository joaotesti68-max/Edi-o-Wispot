import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "./edit";
import { toSceneFrame } from "./edit";
import { Headline, MgShell, lastStarted } from "./MgShell";
import { Sfx } from "./Overlays";
import type { IconKind } from "./theme";
import { Icon, pa } from "./theme";

const CX = 540;
const CY = 980;
const RING = 350;

const DEVICES: { icon: IconKind; angle: number }[] = [
  { icon: "laptop", angle: -135 },
  { icon: "phone", angle: -45 },
  { icon: "desktop", angle: 45 },
  { icon: "tablet", angle: 135 },
];

const polar = (angle: number, r: number) => ({
  x: CX + Math.cos((angle * Math.PI) / 180) * r,
  y: CY + Math.sin((angle * Math.PI) / 180) * r,
});

// "O antivírus sozinho não dá conta disso": threats slip past the lone
// shield and reach every device.
const AntivirusAlone: React.FC<{ fail: number; end: number }> = ({ fail, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shieldIn = spring({ frame: frame - 6, fps, config: { damping: 11 } });
  const shake = frame >= fail && frame < fail + 16 ? Math.sin(frame * 2.6) * (fail + 16 - frame) : 0;
  const crack = interpolate(frame, [fail, fail + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const out = interpolate(frame, [end - 8, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {DEVICES.map((d, i) => {
        const p = polar(d.angle, RING);
        const s = spring({ frame: frame - 10 - i * 4, fps, config: { damping: 12 } });
        // Each threat flies in from off screen and lands on its device.
        const t0 = 18 + i * 9;
        const t = interpolate(frame, [t0, t0 + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const from = polar(d.angle + 25, 1100);
        const bx = interpolate(t, [0, 1], [from.x, p.x]);
        const by = interpolate(t, [0, 1], [from.y, p.y]);
        const hit = t >= 1;
        return (
          <div key={d.icon}>
            <div
              style={{
                position: "absolute",
                left: p.x - 90,
                top: p.y - 90,
                width: 180,
                height: 180,
                borderRadius: 40,
                background: hit ? pa.deep : pa.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${s * (hit ? 1 + 0.05 * Math.sin(frame / 3) : 1)})`,
                boxShadow: "0 18px 40px rgba(28,63,87,0.3)",
              }}
            >
              <Icon kind={d.icon} size={100} color={hit ? pa.white : pa.blue} />
            </div>
            {t > 0 && !hit ? (
              <div
                style={{
                  position: "absolute",
                  left: bx - 46,
                  top: by - 46,
                  width: 92,
                  height: 92,
                  borderRadius: "50%",
                  background: pa.deep,
                  border: `4px solid ${pa.white}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon kind="bug" size={56} />
              </div>
            ) : null}
            {hit ? (
              <div
                style={{
                  position: "absolute",
                  left: p.x + 40,
                  top: p.y - 120,
                  transform: `scale(${spring({ frame: frame - t0 - 22, fps, config: { damping: 8 } })})`,
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    background: pa.light,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `4px solid ${pa.white}`,
                  }}
                >
                  <Icon kind="bug" size={44} />
                </div>
              </div>
            ) : null}
            <Sfx at={t0 + 22} volume={0.18} />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: CX - 170,
          top: CY - 170,
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: pa.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          transform: `translateX(${shake}px) scale(${shieldIn})`,
          boxShadow: "0 24px 60px rgba(28,63,87,0.35)",
        }}
      >
        <svg width={170} height={170} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M12 2.5 4.5 5.5V11c0 5 3.3 9 7.5 10.5 4.2-1.5 7.5-5.5 7.5-10.5V5.5Z"
            fill={pa.blue}
            stroke={pa.blue}
            strokeWidth={1.6}
          />
          <path
            d="M12 3.5 10.5 8.5 13 11 10.8 14.5 12.6 17.5 11.5 21"
            stroke={pa.white}
            strokeWidth={1.4}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - crack}
          />
        </svg>
        <div style={{ fontFamily: pa.font, fontWeight: 800, fontSize: 34, color: pa.deep }}>
          ANTIVÍRUS
        </div>
      </div>
      <Sfx at={fail} src="audio/sfx/whoosh.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

const PILLARS: { icon: IconKind; title: string; tag: string; at: number }[] = [
  { icon: "list", title: "Saber quais equipamentos existem", tag: "INVENTÁRIO", at: 5.45 },
  { icon: "refresh", title: "Manter tudo atualizado", tag: "ATUALIZAÇÕES", at: 7.45 },
  { icon: "key", title: "Controlar quem acessa o quê", tag: "CONTROLE DE ACESSO", at: 8.95 },
  { icon: "eye", title: "Acompanhar cada máquina", tag: "MONITORAMENTO", at: 10.45 },
];

// "Proteger os endpoints é…": four numbered cards, the current one in blue.
const Pillars: React.FC<{ scene: Scene; start: number }> = ({ scene, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start) return null;
  const starts = PILLARS.map((p) => toSceneFrame(scene, p.at));
  const where = toSceneFrame(scene, 12.7);
  const active = lastStarted(starts, frame);
  return (
    <AbsoluteFill>
      {PILLARS.map((p, i) => {
        const s = spring({ frame: frame - starts[i], fps, config: { damping: 14 } });
        const top = 560 + i * 260;
        if (frame < starts[i]) {
          // Empty slots show up with the title, so the four are expected.
          const ghost = spring({ frame: frame - start - i * 3, fps, config: { damping: 14 } });
          return (
            <div
              key={p.tag}
              style={{
                position: "absolute",
                top,
                left: 60,
                right: 60,
                height: 215,
                borderRadius: 36,
                border: "3px dashed rgba(255,255,255,0.45)",
                display: "flex",
                alignItems: "center",
                padding: "0 28px",
                fontFamily: pa.font,
                fontSize: 120,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "-0.04em",
                opacity: ghost,
                transform: `scale(${interpolate(ghost, [0, 1], [0.9, 1])})`,
              }}
            >
              0{i + 1}.
            </div>
          );
        }
        const on = i === active;
        return (
          <div
            key={p.tag}
            style={{
              position: "absolute",
              top,
              left: 60,
              right: 60,
              height: 215,
              borderRadius: 36,
              background: on ? pa.white : "rgba(255,255,255,0.16)",
              border: `3px solid rgba(255,255,255,${on ? 1 : 0.5})`,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 34px 0 28px",
              fontFamily: pa.font,
              transform: `translateX(${interpolate(s, [0, 1], [900, 0])}px) scale(${on ? 1 : 0.96})`,
              boxShadow: on ? "0 24px 60px rgba(28,63,87,0.35)" : "none",
            }}
          >
            <Sfx at={starts[i]} src="audio/sfx/whoosh.wav" volume={0.22} />
            <div
              style={{
                fontWeight: 400,
                fontSize: 120,
                lineHeight: 1,
                color: on ? pa.blue : pa.white,
                width: 170,
                letterSpacing: "-0.04em",
              }}
            >
              0{i + 1}.
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 28,
                  letterSpacing: "0.12em",
                  color: on ? pa.light : "rgba(255,255,255,0.85)",
                }}
              >
                {p.tag}
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 42,
                  lineHeight: 1.12,
                  color: on ? pa.deep : pa.white,
                }}
              >
                {p.title}
                {i === 3 && frame >= where ? (
                  <span style={{ color: on ? pa.blue : pa.white }}>, onde estiver</span>
                ) : null}
              </div>
            </div>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 28,
                background: on ? pa.grad : "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transform: `scale(${on ? 1 + 0.05 * Math.sin(frame / 5) : 1})`,
              }}
            >
              <Icon kind={i === 3 && frame >= where ? "pin" : p.icon} size={64} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const MgAntivirus: React.FC<{ scene: Scene }> = ({ scene }) => {
  const f = (at: number) => toSceneFrame(scene, at);
  const phaseB = f(4.1);
  return (
    <MgShell scene={scene}>
      <Headline
        lines={[
          { from: 4, small: "SÓ O", text: "ANTIVÍRUS?" },
          { from: f(2.74), small: "O ANTIVÍRUS SOZINHO", text: "NÃO DÁ CONTA" },
          { from: phaseB, small: "PROTEGER OS ENDPOINTS É", text: "4 PILARES" },
        ]}
      />
      <AntivirusAlone fail={f(2.74)} end={phaseB} />
      <Pillars scene={scene} start={phaseB} />
    </MgShell>
  );
};
