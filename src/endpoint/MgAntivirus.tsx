import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "./edit";
import { toSceneFrame } from "./edit";
import { Console } from "./Console";
import { MgShell } from "./MgShell";
import { Sfx } from "./Overlays";
import type { IconKind } from "./theme";
import { Icon, pa } from "./theme";

const CX = 540;
const CY = 940;
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

export const MgAntivirus: React.FC<{ scene: Scene }> = ({ scene }) => {
  const f = (at: number) => toSceneFrame(scene, at);
  const phaseB = f(4.1);
  return (
    <MgShell scene={scene}>
      <AntivirusAlone fail={f(2.74)} end={phaseB + 6} />
      <Console open={phaseB} tabs={[phaseB + 8, f(7.45), f(8.95), f(10.45)]} travel={f(12.7)} />
    </MgShell>
  );
};
