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
import { theme } from "./theme";
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

const PANELS: Record<PanelKind, React.FC<{ frames: number }>> = {
  alerta: AlertaPanel,
  diagnostico: DiagnosticoPanel,
  tecnicos: TecnicosPanel,
  documentacao: DocumentacaoPanel,
};

/** Um bloco de fala: o plano gravado, os lower thirds e os painéis por cima. */
const BlockLayer: React.FC<{ block: Block }> = ({ block }) => (
  <AbsoluteFill>
    <Shot video={block.video} frames={block.frames} />

    {block.captions.map((caption) => {
      const from = sec(caption.from);
      const frames = sec(caption.to) - from;
      return (
        <Sequence key={`${block.id}-${caption.from}`} from={from} durationInFrames={frames}>
          <Caption caption={caption} frames={frames} />
        </Sequence>
      );
    })}

    {block.nameCard ? (
      <Sequence
        from={sec(block.nameCard.from)}
        durationInFrames={sec(block.nameCard.to) - sec(block.nameCard.from)}
      >
        <NameCard
          name={block.nameCard.name}
          frames={sec(block.nameCard.to) - sec(block.nameCard.from)}
        />
      </Sequence>
    ) : null}

    {block.panels.map((panel) => {
      const from = sec(panel.from);
      const frames = sec(panel.to) - from;
      const Panel = PANELS[panel.kind];
      return (
        <Sequence key={`${block.id}-${panel.kind}`} from={from} durationInFrames={frames}>
          <Panel frames={frames} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

export const ProAdvancedCartorios: React.FC = () => (
  <AbsoluteFill style={{ fontFamily, background: theme.color.navy }}>
    <Audio src={staticFile("audio/cartorios-theme.mp3")} volume={musicVolume} />

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
            <BlockLayer block={block} />
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
