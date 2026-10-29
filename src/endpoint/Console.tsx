import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { lastStarted } from "./MgShell";
import { Sfx } from "./Overlays";
import type { IconKind } from "./theme";
import { Icon, pa } from "./theme";
import { Cursor, MapGround, WindowBar, ramp } from "./ui";

const W = 980;
const H = 1300;
const BAR = 100;
const TABS_H = 130;
const BODY_Y = BAR + TABS_H;
const BODY_H = H - BODY_Y;

const TABS: { icon: IconKind; label: string }[] = [
  { icon: "list", label: "Inventário" },
  { icon: "refresh", label: "Atualizações" },
  { icon: "key", label: "Acessos" },
  { icon: "eye", label: "Monitoramento" },
];

const DEVICES: { icon: IconKind; name: string; user: string }[] = [
  { icon: "laptop", name: "NB-FINANCEIRO-01", user: "Ana" },
  { icon: "desktop", name: "PC-RECEPCAO-02", user: "Bruno" },
  { icon: "phone", name: "CEL-VENDAS-03", user: "Carla" },
  { icon: "laptop", name: "NB-DIRETORIA-04", user: "Diego" },
  { icon: "tablet", name: "TAB-ESTOQUE-05", user: "Eva" },
  { icon: "desktop", name: "PC-RH-06", user: "Fábio" },
];

const ROW_H = 130;
const ROWS_Y = 150;

const DeviceRow: React.FC<{ i: number; start: number; right?: React.ReactNode }> = ({
  i,
  start,
  right,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 15 } });
  if (frame < start) return null;
  const d = DEVICES[i];
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: ROWS_Y + i * (ROW_H + 14),
        height: ROW_H,
        borderRadius: 26,
        background: "#f3f8fc",
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 28px",
        transform: `translateX(${interpolate(s, [0, 1], [120, 0])}px)`,
        opacity: s,
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 22,
          background: pa.grad,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon kind={d.icon} size={50} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontWeight: 800, fontSize: 32, color: pa.deep }}>{d.name}</span>
        <span style={{ fontWeight: 700, fontSize: 24, color: pa.gray }}>{d.user}</span>
      </div>
      {right}
    </div>
  );
};

const Header: React.FC<{ big: React.ReactNode; small: string; live?: boolean }> = ({
  big,
  small,
  live,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 44,
        top: 30,
        right: 44,
        display: "flex",
        alignItems: "baseline",
        gap: 18,
      }}
    >
      {live ? (
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: pa.light,
            alignSelf: "center",
            boxShadow: `0 0 0 ${8 + 6 * Math.sin(frame / 4)}px rgba(32,163,214,0.25)`,
          }}
        />
      ) : null}
      <span style={{ fontWeight: 800, fontSize: 78, color: pa.blue, lineHeight: 1 }}>{big}</span>
      <span style={{ fontWeight: 700, fontSize: 32, color: pa.gray }}>{small}</span>
    </div>
  );
};

const Inventory: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [start, start + 30], [0, 24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  return (
    <>
      <Header big={n} small="dispositivos na rede" />
      {DEVICES.map((_, i) => (
        <DeviceRow key={i} i={i} start={start + i * 5} />
      ))}
    </>
  );
};

const Updates: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const done = (i: number) => start + 10 + i * 6 + 16;
  const count = DEVICES.filter((_, i) => frame >= done(i)).length;
  return (
    <>
      <Header big={`${count}/6`} small="atualizados" />
      {DEVICES.map((_, i) => {
        const p = ramp(frame, start + 10 + i * 6, done(i), false);
        const ok = frame >= done(i);
        return (
          <DeviceRow
            key={i}
            i={i}
            start={start}
            right={
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 200, height: 18, borderRadius: 9, background: "#d5e6f2" }}>
                  <div
                    style={{
                      width: `${p * 100}%`,
                      height: "100%",
                      borderRadius: 9,
                      background: pa.grad,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: ok ? pa.blue : "#d5e6f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${ok ? spring({ frame: frame - done(i), fps, config: { damping: 8 } }) : 1})`,
                  }}
                >
                  {ok ? <Icon kind="check" size={34} strokeWidth={3.2} /> : null}
                </div>
              </div>
            }
          />
        );
      })}
    </>
  );
};

const SYSTEMS = ["ERP", "Financeiro", "RH"];
// Who may open what; the click revokes Bruno's access to Financeiro.
const GRANTS = [
  [true, true, false],
  [true, true, false],
  [true, false, false],
  [true, true, true],
];

const Access: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revoke = start + 30;
  const colX = (c: number) => 400 + c * 180;
  const rowY = (r: number) => 250 + r * 190;
  return (
    <>
      <Header big="4" small="usuários · 3 sistemas" />
      {SYSTEMS.map((name, c) => (
        <div
          key={name}
          style={{
            position: "absolute",
            left: colX(c) - 90,
            width: 180,
            top: 150,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 28,
            color: pa.deep,
          }}
        >
          {name}
        </div>
      ))}
      {DEVICES.slice(0, 4).map((d, r) => (
        <div key={d.user}>
          <div
            style={{
              position: "absolute",
              left: 50,
              top: rowY(r) - 50,
              height: 100,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: pa.grad,
                color: pa.white,
                fontWeight: 800,
                fontSize: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {d.user[0]}
            </div>
            <span style={{ fontWeight: 800, fontSize: 32, color: pa.deep }}>{d.user}</span>
          </div>
          {SYSTEMS.map((_, c) => {
            const revoked = r === 1 && c === 1 && frame >= revoke;
            const allowed = GRANTS[r][c] && !revoked;
            const s = spring({ frame: frame - start - 4 - (r * 3 + c) * 2, fps, config: { damping: 11 } });
            return (
              <div
                key={c}
                style={{
                  position: "absolute",
                  left: colX(c) - 46,
                  top: rowY(r) - 46,
                  width: 92,
                  height: 92,
                  borderRadius: 26,
                  background: allowed ? pa.blue : "#e3eaf0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${s * (revoked && frame < revoke + 6 ? 1.15 : 1)})`,
                }}
              >
                <Icon
                  kind={allowed ? "check" : "lock"}
                  size={50}
                  color={allowed ? pa.white : pa.gray}
                  strokeWidth={allowed ? 3 : 2.2}
                />
              </div>
            );
          })}
        </div>
      ))}
      <Cursor
        keys={[
          { at: start + 6, x: 900, y: 1000 },
          { at: revoke, x: colX(1), y: rowY(1), click: true },
          { at: revoke + 20, x: 820, y: 900 },
        ]}
      />
    </>
  );
};

const PINS = [
  { x: 180, y: 300, icon: "desktop" as IconKind },
  { x: 520, y: 220, icon: "laptop" as IconKind },
  { x: 780, y: 360, icon: "phone" as IconKind },
  { x: 300, y: 600, icon: "tablet" as IconKind },
  { x: 700, y: 660, icon: "desktop" as IconKind },
];

const Monitor: React.FC<{ start: number; travel: number }> = ({ start, travel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapW = W - 80;
  const mapH = 780;
  // One laptop leaves the office and keeps reporting from the road.
  const t = ramp(frame, travel, travel + 40);
  const lx = interpolate(t, [0, 0.5, 1], [180, 520, 820]);
  const ly = interpolate(t, [0, 0.5, 1], [480, 420, 560]);
  const points = Array.from({ length: 24 }, (_, k) => {
    const v = Math.sin((k + frame / 3) * 0.9) * 0.5 + Math.sin((k + frame / 5) * 0.35) * 0.5;
    return `${k * (mapW / 23)},${60 - v * 40}`;
  }).join(" ");
  return (
    <>
      <Header big="Ao vivo" small="6 de 6 online" live />
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 150,
          width: mapW,
          height: mapH,
          borderRadius: 30,
          overflow: "hidden",
        }}
      >
        <MapGround width={mapW} height={mapH} />
        {[...PINS, { x: lx, y: ly, icon: "laptop" as IconKind }].map((p, i) => {
          const s = spring({ frame: frame - start - i * 3, fps, config: { damping: 11 } });
          const moving = i === PINS.length;
          const ring = ((frame + i * 6) % 30) / 30;
          return (
            <div key={i} style={{ position: "absolute", left: p.x - 50, top: p.y - 50 }}>
              <div
                style={{
                  position: "absolute",
                  left: 50 - 50 - ring * 30,
                  top: 50 - 50 - ring * 30,
                  width: 100 + ring * 60,
                  height: 100 + ring * 60,
                  borderRadius: "50%",
                  border: `4px solid ${pa.light}`,
                  opacity: 1 - ring,
                }}
              />
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: moving ? pa.deep : pa.grad,
                  border: `5px solid ${pa.white}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${s})`,
                  boxShadow: "0 10px 24px rgba(28,63,87,0.3)",
                }}
              >
                <Icon kind={p.icon} size={54} />
              </div>
            </div>
          );
        })}
      </div>
      <svg
        width={mapW}
        height={120}
        style={{ position: "absolute", left: 40, top: 950 }}
        viewBox={`0 0 ${mapW} 120`}
      >
        <polyline points={points} fill="none" stroke={pa.blue} strokeWidth={6} strokeLinejoin="round" />
      </svg>
    </>
  );
};

// The endpoint management console the four pillars are shown in: one tab
// per pillar, switching as each one is mentioned.
export const Console: React.FC<{ open: number; tabs: number[]; travel: number }> = ({
  open,
  tabs,
  travel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < open) return null;
  const enter = spring({ frame: frame - open, fps, config: { damping: 15 } });
  const active = Math.max(0, lastStarted(tabs, frame));
  const since = frame - Math.max(open, tabs[active]);
  const swap = spring({ frame: since, fps, config: { damping: 16 } });
  const bodies = [
    <Inventory key="inv" start={tabs[0]} />,
    <Updates key="upd" start={tabs[1]} />,
    <Access key="acc" start={tabs[2]} />,
    <Monitor key="mon" start={tabs[3]} travel={travel} />,
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        top: 300,
        width: W,
        height: H,
        borderRadius: 44,
        background: pa.white,
        overflow: "hidden",
        fontFamily: pa.font,
        boxShadow: "0 40px 90px rgba(28,63,87,0.45)",
        transform: `translateY(${interpolate(enter, [0, 1], [500, 0])}px) scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
        opacity: enter,
      }}
    >
      <WindowBar title="Gestão de endpoints" height={BAR} />
      <div style={{ position: "absolute", top: BAR, left: 0, right: 0, height: TABS_H, display: "flex", borderBottom: "3px solid #e3eef6" }}>
        {TABS.map((t, i) => {
          const on = i === active && frame >= tabs[0];
          return (
            <div
              key={t.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: on ? pa.blue : "#9aa7b0",
                fontWeight: 800,
                fontSize: 22,
                borderBottom: on ? `6px solid ${pa.blue}` : "6px solid transparent",
              }}
            >
              <Icon kind={t.icon} size={44} color={on ? pa.blue : "#9aa7b0"} />
              {t.label}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: BODY_Y,
          left: 0,
          width: W,
          height: BODY_H,
          transform: `translateX(${active > 0 ? interpolate(swap, [0, 1], [80, 0]) : 0}px)`,
          opacity: active > 0 ? swap : 1,
        }}
      >
        {frame >= tabs[0] ? bodies[active] : null}
      </div>
      {tabs.map((t) => (
        <Sfx key={t} at={t} src="audio/sfx/whoosh.wav" volume={0.2} />
      ))}
    </div>
  );
};
