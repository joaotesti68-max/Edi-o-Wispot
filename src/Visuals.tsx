import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { CalendarIcon, CheckIcon, ClockIcon, DocIcon, ScaleIcon, TrendingUpIcon } from "./Icons";
import type { VisualKey } from "./content";

/** takeStarts: frame em que cada take do bloco começa, para sincronizar com a fala. */
type VisualProps = { takeStarts: number[] };

const PANEL: React.CSSProperties = {
  background: "rgba(6,9,12,0.5)",
  border: `1.5px solid ${brand.alpha.light30}`,
  borderRadius: 20,
  padding: "16px 22px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  backdropFilter: "blur(6px)",
};

const LABEL: React.CSSProperties = {
  fontFamily: brand.fontFamily,
  fontWeight: 700,
  fontSize: 23,
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

const DeadlineBar: React.FC<VisualProps> = () => {
  const frame = useCurrentFrame();
  const { opacity, shift } = useEnter(15);
  const fill = interpolate(frame, [22, 80], [0, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Pulso no marcador de prazo, para o olho voltar ali.
  const pulse = 1 + Math.sin(frame / 7.5) * 0.06;

  return (
    <div style={{ ...PANEL, opacity, transform: `translateY(${shift}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ScaleIcon size={26} color={brand.colors.primaryLight} strokeWidth={2.2} />
        <div style={LABEL}>Adequação obrigatória</div>
      </div>
      <div style={{ position: "relative", height: 14 }}>
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

const CalendarWindow: React.FC<VisualProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity, shift } = useEnter(15);
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
            frame: frame - 25 - i * 9,
            fps,
            config: { damping: 14, mass: 0.6 },
          });
          return (
            <div
              key={month}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "12px 0",
                borderRadius: 14,
                background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primaryLight})`,
                fontFamily: brand.fontFamily,
                fontWeight: 800,
                fontSize: 34,
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

const RiskMeter: React.FC<VisualProps> = () => {
  const frame = useCurrentFrame();
  const { opacity, shift } = useEnter(15);
  const blocks = 8;
  const lit = interpolate(frame, [28, 98], [0, blocks], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrow = interpolate(frame, [28, 98], [10, -6], {
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

const ProcessSteps: React.FC<VisualProps> = ({ takeStarts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacity, shift } = useEnter(12);
  const steps = ["Levantamento de risco", "Plano e execução", "Documentação final"];

  // O bloco tem três takes: ele apresenta o time, depois enumera o processo,
  // depois emenda o "sem parar a operação". As etapas marcam junto com a fala
  // do meio, e o rodapé entra com a última.
  const checkFrom = takeStarts[1] ?? 30;
  const noteFrom = takeStarts[2] ?? checkFrom + 70;
  const perStep = Math.max(12, Math.round(((noteFrom - checkFrom) / steps.length) * 0.8));

  return (
    <div style={{ ...PANEL, opacity, transform: `translateY(${shift}px)`, gap: 9 }}>
      {steps.map((step, i) => {
        const item = spring({ frame: frame - 12 - i * 8, fps, config: { damping: 15, mass: 0.6 } });
        const check = spring({
          frame: frame - checkFrom - i * perStep,
          fps,
          config: { damping: 13, mass: 0.5 },
        });
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
                width: 34,
                height: 34,
                borderRadius: 11,
                // Vai de pendente para marcado quando ele cita a etapa.
                background: `rgba(54,150,205,${interpolate(check, [0, 1], [0.22, 1])})`,
                border: `1.5px solid ${brand.alpha.light30}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transform: `scale(${interpolate(check, [0, 1], [1, 1.12])})`,
              }}
            >
              <div style={{ opacity: check, transform: `scale(${check})` }}>
                <CheckIcon size={20} color={brand.colors.white} strokeWidth={2.8} />
              </div>
            </div>
            <div
              style={{
                fontFamily: brand.fontFamily,
                fontWeight: 700,
                fontSize: 28,
                color: brand.colors.white,
                opacity: interpolate(check, [0, 1], [0.62, 1]),
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
          opacity: interpolate(frame, [noteFrom, noteFrom + 14], [0, 0.85], {
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
            fontSize: 22,
            color: brand.colors.white,
          }}
        >
          sem parar a operação do dia a dia
        </div>
      </div>
    </div>
  );
};

const UrgencyCta: React.FC<VisualProps> = ({ takeStarts }) => {
  const frame = useCurrentFrame();
  // O bloco tem dois takes: "O prazo não espera" e depois a chamada. O painel
  // entra junto com o segundo, quando ele de fato convida a agendar.
  const { opacity, shift } = useEnter(takeStarts[1] ?? 12);
  // Ponteiro girando: leitura imediata de tempo correndo.
  const hand = interpolate(frame, [0, 120], [0, 360]);
  const pulse = 1 + Math.sin(frame / 9) * 0.03;

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
          fontSize: 34,
          color: brand.colors.white,
          lineHeight: 1.15,
        }}
      >
        Agende seu diagnóstico
      </div>
    </div>
  );
};

const VISUALS: Record<VisualKey, React.FC<VisualProps>> = {
  law: DeadlineBar,
  calendar: CalendarWindow,
  risk: RiskMeter,
  steps: ProcessSteps,
  clock: UrgencyCta,
};

export const Visual: React.FC<{ visual: VisualKey; takeStarts: number[] }> = ({
  visual,
  takeStarts,
}) => {
  const Component = VISUALS[visual];
  return <Component takeStarts={takeStarts} />;
};
