import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { fontFamily } from "../shared/loadFont";
import { Caption } from "./Caption";
import { Chrome, musicVolume } from "./Chrome";
import { EndCard } from "./EndCard";
import { NameCard } from "./NameCard";
import { Shot } from "./Shot";
import { SpeechCaption } from "./SpeechCaption";
import { theme } from "./theme";
import { speechCaptions } from "./captions";
import { type PanelProps } from "./PanelFrame";
import { AlertaPanel } from "./panels/AlertaPanel";
import { DiagnosticoPanel } from "./panels/DiagnosticoPanel";
import { DocumentacaoPanel } from "./panels/DocumentacaoPanel";
import { TecnicosPanel } from "./panels/TecnicosPanel";
import {
  ENDCARD_FRAMES,
  FPS,
  TRANSITION_FRAMES,
  blocks,
  totalFrames,
  type Block,
  type PanelKind,
} from "./content";

const sec = (seconds: number) => Math.round(seconds * FPS);

const PANELS: Record<PanelKind, React.FC<PanelProps>> = {
  alerta: AlertaPanel,
  diagnostico: DiagnosticoPanel,
  tecnicos: TecnicosPanel,
  documentacao: DocumentacaoPanel,
};

/**
 * Um bloco de fala: o plano gravado, os lower thirds e os painéis por cima.
 *
 * Enquanto o bloco atravessa uma transição os dois lados são desenhados ao mesmo
 * tempo. Por isso toda camada de texto é recolhida antes da transição de saída —
 * e, nos blocos que não são o primeiro, só entra depois da de entrada. Sem isso
 * a última legenda de um bloco aparece empilhada com a primeira do seguinte.
 */
const BlockLayer: React.FC<{ block: Block; isFirst: boolean }> = ({ block, isFirst }) => {
  const windowStart = isFirst ? 0 : TRANSITION_FRAMES;
  const windowEnd = block.frames - TRANSITION_FRAMES;

  /** Recorta uma sobreposição na janela em que o bloco está sozinho na tela. */
  const clamp = (from: number, to: number) => {
    const start = Math.max(from, windowStart);
    const frames = Math.min(to, windowEnd) - start;
    return { start, frames };
  };

  return (
    <AbsoluteFill>
      <Shot video={block.video} frames={block.frames} />

      {block.captions.map((caption) => {
        const { start, frames } = clamp(sec(caption.from), sec(caption.to));
        if (frames <= 0) return null;
        return (
          <Sequence key={`${block.id}-${caption.from}`} from={start} durationInFrames={frames}>
            <Caption caption={caption} frames={frames} />
          </Sequence>
        );
      })}

      {block.nameCard ? (
        (() => {
          const { start, frames } = clamp(sec(block.nameCard.from), sec(block.nameCard.to));
          if (frames <= 0) return null;
          return (
            <Sequence from={start} durationInFrames={frames}>
              <NameCard name={block.nameCard.name} frames={frames} />
            </Sequence>
          );
        })()
      ) : null}

      {block.panels.map((panel) => {
        const from = sec(panel.from);
        // Um painel que segura até o fim atravessa a transição por inteiro: é
        // ele, e não o plano gravado, que dissolve no bloco seguinte.
        const frames = (panel.holdToEnd ? block.frames : sec(panel.to)) - from;
        const Panel = PANELS[panel.kind];
        return (
          <Sequence key={`${block.id}-${panel.kind}`} from={from} durationInFrames={frames}>
            <Panel frames={frames} fadeOut={!panel.holdToEnd} />
          </Sequence>
        );
      })}

      {/* A legenda fica por último: ela é lida por cima de tudo, inclusive dos painéis. */}
      {(speechCaptions[block.id] ?? []).map((caption, i, all) => {
        const { start, frames } = clamp(sec(caption.from), sec(caption.to));
        if (frames <= 0) return null;
        return (
          <Sequence key={`${block.id}-cc-${caption.from}`} from={start} durationInFrames={frames}>
            <SpeechCaption caption={caption} frames={frames} isLast={i === all.length - 1} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const ProAdvancedCartorios: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, background: theme.color.navy }}>
    <Audio src={staticFile("audio/cartorios-trilha.mp3")} volume={musicVolume} />

    <TransitionSeries>
      {blocks.map((block, i) => (
        <React.Fragment key={block.id}>
          {i === 0 ? null : (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
            />
          )}
          <TransitionSeries.Sequence durationInFrames={block.frames}>
            <BlockLayer block={block} isFirst={i === 0} />
          </TransitionSeries.Sequence>
        </React.Fragment>
      ))}

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={ENDCARD_FRAMES}>
        <EndCard />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <Chrome />
  </AbsoluteFill>
);

export const CartoriosComposition = () => (
  <Composition
    id="ProAdvancedCartorios"
    component={ProAdvancedCartorios}
    durationInFrames={totalFrames}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
