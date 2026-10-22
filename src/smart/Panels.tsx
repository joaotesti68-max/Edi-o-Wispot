import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";
import { Word } from "./Opening";
import { Icon, type IconKind, clamp, pa, usePop } from "./theme";

const big = (size: number): React.CSSProperties => ({
  fontFamily: pa.font,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1,
  color: pa.white,
  textTransform: "uppercase",
  letterSpacing: "-0.02em",
  textShadow: "0 6px 30px rgba(10,21,32,0.55)",
});

const glass: React.CSSProperties = {
  background: "rgba(10,21,32,0.86)",
  border: "3px solid rgba(32,163,214,0.55)",
  borderRadius: 30,
  boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
  fontFamily: pa.font,
};

// "...isso que deveria preocupar a sua empresa." Red alert pulse + callout.
export const CompanyAlert: React.FC<{
  pulse: number;
  line: number;
  company: number;
  end: number;
}> = ({ pulse, line, company, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < pulse || frame >= end) return null;
  const glow = 0.35 + 0.3 * Math.sin((frame - pulse) / 3.5);
  const s = spring({ frame: frame - company, fps, config: { damping: 9, mass: 0.6 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 ${180 + glow * 120}px rgba(255,59,69,${glow})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 1330,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Word start={line} style={{ ...big(56), display: "flex", alignItems: "center", gap: 16 }}>
          <Icon kind="warning" size={64} color={pa.red} strokeWidth={2.4} />
          Isso deveria preocupar
        </Word>
        {frame >= company ? (
          <div
            style={{
              ...big(124),
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: pa.white,
              color: pa.ink,
              textShadow: "none",
              padding: "18px 40px 22px",
              borderRadius: 22,
              transform: `scale(${interpolate(s, [0, 1], [1.9, 1])}) rotate(-2deg)`,
              boxShadow: "0 20px 70px rgba(255,59,69,0.5)",
            }}
          >
            <Icon kind="building" size={110} color={pa.blue} strokeWidth={2.2} />
            Sua empresa
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// "Quando o vazamento vem de dentro, firewall nenhum resolve."
// Attacks from outside bounce off the wall; the leak from inside walks
// straight through it.
export const FirewallPanel: React.FC<{
  start: number;
  inside: number;
  verdict: number;
  end: number;
}> = ({ start, inside, verdict, end }) => {
  const { enter, exit, visible, frame } = usePop(start, end, 14);
  if (!visible) return null;
  const W = 960;
  const H = 470;
  const wallX = W / 2;
  const failed = frame >= verdict;
  const verdictIn = spring({ frame: frame - verdict, fps: 30, config: { damping: 9 } });

  // Outside attacks: travel right→left, stop at the wall and burst.
  const attacks = [0, 9, 18, 27].map((d, i) => {
    const t0 = start + 4 + d;
    const p = interpolate(frame, [t0, t0 + 14], [0, 1], clamp);
    const x = interpolate(p, [0, 1], [W - 120, wallX + 52]);
    const hit = frame >= t0 + 14;
    const burst = interpolate(frame, [t0 + 14, t0 + 22], [0, 1], clamp);
    return { x, y: 150 + i * 60, hit, burst, visible: frame >= t0 && frame < t0 + 22 };
  });
  // The leak: from the user inside, through the wall, out to the internet.
  const leaks = [0, 6, 12, 18, 24, 30].map((d, i) => {
    const t0 = inside + d;
    const p = interpolate(frame, [t0, t0 + 26], [0, 1], clamp);
    return {
      x: interpolate(p, [0, 1], [150, W - 150]),
      y: 220 + Math.sin(i * 1.7) * 60,
      visible: frame >= t0 && p < 1,
    };
  });

  const side = (icon: IconKind, label: string, x: number, color: string) => (
    <div
      style={{
        position: "absolute",
        left: x - 90,
        top: 120,
        width: 180,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: color,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon kind={icon} size={76} strokeWidth={1.9} />
      </div>
      <div style={{ fontWeight: 800, fontSize: 30, color: pa.white, letterSpacing: "0.08em" }}>
        {label}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 1230,
        left: (1080 - W) / 2,
        width: W,
        height: H,
        ...glass,
        borderColor: failed ? pa.red : "rgba(32,163,214,0.55)",
        transform: `translateY(${interpolate(enter, [0, 1], [400, 0])}px) scale(${exit})`,
        opacity: Math.min(1, enter * 1.4),
      }}
    >
      {side("user", "DENTRO", 110, frame >= inside ? pa.red : pa.grad)}
      {side("globe", "INTERNET", W - 110, "rgba(255,255,255,0.15)")}

      {/* the wall */}
      <div
        style={{
          position: "absolute",
          left: wallX - 40,
          top: 50,
          width: 80,
          height: 300,
          borderRadius: 12,
          background: failed
            ? "repeating-linear-gradient(0deg, #ff3b45 0 34px, #b3222b 34px 40px)"
            : `repeating-linear-gradient(0deg, ${pa.blue} 0 34px, ${pa.navy} 34px 40px)`,
          boxShadow: `0 0 40px ${failed ? "rgba(255,59,69,0.6)" : "rgba(32,163,214,0.6)"}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: wallX - 50,
          top: 0,
          width: 100,
          display: "grid",
          placeItems: "center",
          transform: "translateY(-20px)",
        }}
      >
        <div style={{ background: pa.ink, borderRadius: "50%", padding: 8 }}>
          <Icon kind="shield" size={56} color={failed ? pa.red : pa.cyan} strokeWidth={2.4} />
        </div>
      </div>

      {attacks.map((a, i) =>
        a.visible ? (
          <div
            key={`a${i}`}
            style={{
              position: "absolute",
              left: a.x - 16,
              top: a.y - 16,
              width: 32,
              height: 32,
              borderRadius: 8,
              background: pa.white,
              opacity: a.hit ? 1 - a.burst : 1,
              transform: `scale(${a.hit ? 1 + a.burst * 2.5 : 1}) rotate(45deg)`,
              boxShadow: "0 0 20px rgba(255,255,255,0.8)",
            }}
          />
        ) : null,
      )}
      {leaks.map((l, i) =>
        l.visible ? (
          <div
            key={`l${i}`}
            style={{
              position: "absolute",
              left: l.x - 18,
              top: l.y - 18,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: pa.red,
              boxShadow: "0 0 26px rgba(255,59,69,0.9)",
            }}
          />
        ) : null,
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 34,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 50,
          color: failed ? pa.red : pa.white,
          letterSpacing: "0.04em",
        }}
      >
        {failed ? (
          <span
            style={{
              display: "inline-block",
              transform: `scale(${interpolate(verdictIn, [0, 1], [1.3, 1])})`,
            }}
          >
            FIREWALL NENHUM RESOLVE
          </span>
        ) : (
          "FIREWALL"
        )}
      </div>
      {failed ? (
        <div
          style={{
            position: "absolute",
            left: wallX - 120,
            top: 80,
            transform: `scale(${verdictIn})`,
          }}
        >
          <Icon kind="x" size={240} color={pa.red} strokeWidth={3.2} />
        </div>
      ) : null}
    </div>
  );
};

// "Segurança não é só proteger quem está de fora."
export const NotJustOutside: React.FC<{
  security: number;
  notOnly: number;
  outside: number;
  end: number;
}> = ({ security, notOnly, outside, end }) => {
  const frame = useCurrentFrame();
  if (frame < security || frame >= end) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 1270,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <Word
        start={security}
        style={{
          ...big(110),
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: pa.grad,
          padding: "14px 36px 20px 24px",
          borderRadius: 22,
        }}
      >
        <Icon kind="shield" size={100} strokeWidth={2.2} />
        Segurança
      </Word>
      <Word
        start={notOnly}
        style={{ ...big(60), background: pa.red, padding: "10px 24px 14px", borderRadius: 12, transform: "rotate(-2deg)" }}
      >
        não é só
      </Word>
      <Word start={outside} style={{ ...big(62), whiteSpace: "nowrap" }}>
        proteger quem está <span style={{ color: pa.cyan }}>de fora</span>
      </Word>
    </div>
  );
};

type Row = { at: number; who: string; what: string; alert?: boolean };

// "É saber quem lá dentro está acessando o quê." An access log types in;
// the last row is the leak.
export const AccessLog: React.FC<{ start: number; rows: Row[]; end: number }> = ({
  start,
  rows,
  end,
}) => {
  const { enter, exit, visible, frame } = usePop(start, end, 14);
  if (!visible) return null;
  const cell: React.CSSProperties = { fontSize: 33, fontWeight: 700, color: pa.white, whiteSpace: "nowrap" };
  return (
    <div
      style={{
        position: "absolute",
        top: 1215,
        left: 50,
        right: 50,
        padding: "30px 34px 34px",
        ...glass,
        transform: `translateY(${interpolate(enter, [0, 1], [500, 0])}px) scale(${exit})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: pa.red,
            opacity: Math.sin(frame / 4) > 0 ? 1 : 0.3,
          }}
        />
        <div style={{ fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: pa.cyan }}>
          LOG DE ACESSOS · AO VIVO
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr 150px",
          columnGap: 20,
          padding: "0 18px 12px",
          borderBottom: "2px solid rgba(255,255,255,0.15)",
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        <div>QUEM</div>
        <div>ACESSOU O QUÊ</div>
        <div>STATUS</div>
      </div>
      {rows.map((r) => {
        if (frame < r.at) return null;
        const typed = Math.floor(interpolate(frame, [r.at, r.at + 12], [0, r.what.length], clamp));
        const s = spring({ frame: frame - r.at, fps: 30, config: { damping: 14 } });
        const flash = r.alert ? 0.5 + 0.5 * Math.sin((frame - r.at) / 3) : 0;
        return (
          <div
            key={r.who}
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr 150px",
              columnGap: 20,
              alignItems: "center",
              marginTop: 14,
              padding: "16px 18px",
              borderRadius: 14,
              background: r.alert ? `rgba(255,59,69,${0.25 + flash * 0.35})` : "rgba(255,255,255,0.06)",
              border: r.alert ? `3px solid ${pa.red}` : "3px solid transparent",
              transform: `translateX(${interpolate(s, [0, 1], [-80, 0])}px)`,
              opacity: s,
            }}
          >
            <div style={{ ...cell, display: "flex", alignItems: "center", gap: 12 }}>
              <Icon kind={r.alert ? "server" : "user"} size={38} color={r.alert ? pa.red : pa.cyan} />
              {r.who}
            </div>
            <div style={cell}>
              {r.what.slice(0, typed)}
              {typed < r.what.length ? "▌" : ""}
            </div>
            <div
              style={{
                ...cell,
                fontWeight: 800,
                fontSize: 28,
                color: r.alert ? pa.white : "#5be08d",
                opacity: typed >= r.what.length ? 1 : 0,
              }}
            >
              {r.alert ? "⚠ ALERTA" : "✓ OK"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// "Quer saber se a sua empresa está preparada?"
export const Prepared: React.FC<{ start: number; prepared: number; end: number }> = ({
  start,
  prepared,
  end,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start || frame >= end) return null;
  const q = spring({ frame: frame - prepared, fps, config: { damping: 8 } });
  return (
    <AbsoluteFill>
      {frame >= prepared ? (
        <div
          style={{
            position: "absolute",
            right: -40,
            top: 1000,
            ...big(760),
            color: "rgba(32,163,214,0.35)",
            textShadow: "none",
            transform: `rotate(${interpolate(q, [0, 1], [40, 12])}deg) scale(${q})`,
          }}
        >
          ?
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 1330,
          left: 70,
          right: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <Word start={start} style={big(84)}>
          Sua empresa
        </Word>
        <Word start={start + 8} style={big(84)}>
          está
        </Word>
        <Word
          start={prepared}
          style={{ ...big(118), background: pa.grad, padding: "12px 30px 18px", borderRadius: 20 }}
        >
          preparada?
        </Word>
      </div>
    </AbsoluteFill>
  );
};

// "Fale com a Pro Advanced." Logo pops in a glass pill.
export const LogoPill: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start || frame >= end) return null;
  const s = spring({ frame: frame - start, fps, config: { damping: 10, mass: 0.6 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 1400,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: pa.grad,
          borderRadius: 34,
          padding: "34px 60px",
          boxShadow: "0 30px 80px rgba(32,163,214,0.5)",
          transform: `scale(${interpolate(s, [0, 1], [0.4, 1])}) rotate(${interpolate(s, [0, 1], [-10, 0])}deg)`,
          opacity: Math.min(1, s * 2),
        }}
      >
        <Img src={staticFile(brand.logo.white)} style={{ width: 560, display: "block" }} />
      </div>
    </div>
  );
};
