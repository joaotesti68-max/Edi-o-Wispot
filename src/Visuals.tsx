import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { CalendarIcon, CheckIcon, ClockIcon, DocIcon, ScaleIcon, TrendingUpIcon } from "./Icons";
import type { VisualKey } from "./content";

const PANEL: React.CSSProperties = {
  background: "rgba(6,9,12,0.5)",
  border: `1.5px solid ${brand.alpha.light30}`,
  borderRadius: 20,
  padding: "22px 26px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  backdropFilter: "blur(6px)",
};

const LABEL: React.CSSProperties = {
  fontFamily: brand.fontFamily,
  fontWeight: 700,
  fontSize: 25,
  letterSpacing: 0.6,
  color: brand.colors.white,
  textTransform: "uppercase",
};

/** Entrada padrão dos painéis, com atraso para não competir com o corte. */
const useEnter = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.7 } });
  return {
    opacity: interpolate(enter, [0, 1], [0, 1]),
    shift: interpolate(enter, [0, 1], [28, 0]),
    enter,
  };
};

const DeadlineBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { opacity, shift } = useEnter(12);
  const fill = interpolate(frame, [18, 64], [0, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Pulso no marcador de prazo, para o olho voltar ali.
  const pulse = 1 + Math.sin(frame / 6) * 0.06;

  return (
    <div style={{ ...PANEL, opacity, transform: `translateY(${shift}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ScaleIcon size={26} color={brand.colors.primaryLight} strokeWidth={2.2} />
        <div style={LABEL}>Adequação obrigatória</div>
      </div>
      <div style={{ position: "relative", height: 16 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: brand.alpha.primary30,
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: `${fill * 100}%`,
            background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.primaryLight})`,
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -9,
            right: 0,
            width: 6,
            height: 34,
            borderRadius: 3,
            background: brand.colors.white,
            transform: `scaleY(${pulse})`,
          }}
        />
      </div>
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 700,
          fontSize: 23,
          color: brand.colors.white,
          opacity: 0.82,
          alignSelf: "flex-end",
        }}
      >
        fim do prazo
      </div>
    </div>
  );
};

const CalendarWindow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity, shift } = useEnter(12);
  const months = ["Ago", "Set", "Out"];

  return (
    <div style={{ ...PANEL, opacity, transform: `translateY(${shift}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CalendarIcon size={26} color={brand.colors.primaryLight} strokeWidth={2.2} />
        <div style={LABEL}>Janela de comprovação</div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {months.map((month, i) => {
          const chip = spring({
            frame: frame - 20 - i * 7,
            fps,
            config: { damping: 14, mass: 0.6 },
          });
          return (
            <div
              key={month}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "16px 0",
                borderRadius: 14,
                background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primaryLight})`,
                fontFamily: brand.fontFamily,
                fontWeight: 800,
                fontSize: 42,
                color: brand.colors.white,
                textTransform: "uppercase",
                letterSpacing: 1,
                opacity: interpolate(chip, [0, 1], [0, 1]),
                transform: `scale(${interpolate(chip, [0, 1], [0.7, 1])})`,
              }}
            >
              {month}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RiskMeter: React.FC = () => {
  const frame = useCurrentFrame();
  const { opacity, shift } = useEnter(12);
  const blocks = 8;
  const lit = interpolate(frame, [22, 78], [0, blocks], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrow = interpolate(frame, [22, 78], [10, -6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ ...PANEL, opacity, transform: `translateY(${shift}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <TrendingUpIcon size={26} color={brand.colors.primaryLight} strokeWidth={2.2} />
        <div style={LABEL}>Penalidade e auditoria</div>
        <div style={{ flex: 1 }} />
        <div style={{ transform: `translateY(${arrow}px)` }}>
          <TrendingUpIcon size={30} color={brand.colors.white} strokeWidth={2.6} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: blocks }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 20,
              borderRadius: 5,
              background: i < lit ? brand.colors.primaryLight : brand.alpha.primary30,
              // Os últimos blocos crescem, reforçando a escalada do risco.
              transform: `scaleY(${1 + (i / blocks) * 0.5})`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ProcessSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity, shift } = useEnter(10);
  const steps = ["Levantamento de risco", "Plano e execução", "Documentação final"];

  return (
    <div style={{ ...PANEL, opacity, transform: `translateY(${shift}px)`, gap: 12 }}>
      {steps.map((step, i) => {
        const item = spring({ frame: frame - 16 - i * 14, fps, config: { damping: 15, mass: 0.6 } });
        return (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: interpolate(item, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(item, [0, 1], [-20, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: brand.colors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CheckIcon size={22} color={brand.colors.white} strokeWidth={2.8} />
            </div>
            <div
              style={{
                fontFamily: brand.fontFamily,
                fontWeight: 700,
                fontSize: 31,
                color: brand.colors.white,
              }}
            >
              {step}
            </div>
          </div>
        );
      })}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 4,
          opacity: interpolate(frame, [58, 72], [0, 0.85], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <DocIcon size={22} color={brand.colors.primaryLight} strokeWidth={2.2} />
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 700,
            fontSize: 24,
            color: brand.colors.white,
          }}
        >
          sem parar a operação do dia a dia
        </div>
      </div>
    </div>
  );
};

const UrgencyCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { opacity, shift } = useEnter(10);
  // Ponteiro girando: leitura imediata de tempo correndo.
  const hand = interpolate(frame, [0, 96], [0, 360]);
  const pulse = 1 + Math.sin(frame / 7) * 0.03;

  return (
    <div
      style={{
        ...PANEL,
        opacity,
        transform: `translateY(${shift}px) scale(${pulse})`,
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
        <ClockIcon size={56} color={brand.colors.primaryLight} strokeWidth={2} />
        <div
          style={{
            position: "absolute",
            left: 27,
            top: 16,
            width: 2.5,
            height: 13,
            background: brand.colors.white,
            borderRadius: 2,
            transformOrigin: "50% 100%",
            transform: `rotate(${hand}deg)`,
          }}
        />
      </div>
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontWeight: 800,
          fontSize: 38,
          color: brand.colors.white,
          lineHeight: 1.15,
        }}
      >
        Agende seu diagnóstico
      </div>
    </div>
  );
};

const VISUALS: Record<VisualKey, React.FC> = {
  law: DeadlineBar,
  calendar: CalendarWindow,
  risk: RiskMeter,
  steps: ProcessSteps,
  clock: UrgencyCta,
};

export const Visual: React.FC<{ visual: VisualKey }> = ({ visual }) => {
  const Component = VISUALS[visual];
  return <Component />;
};
