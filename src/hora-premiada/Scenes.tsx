import React from "react";
import { brand } from "./brand";
import { SPEED, clipById } from "./content";
import { Scene } from "./Scene";
import { Chip, Cue, Eyebrow, IconBadge, OverlayStack } from "./Ui";
import { CouponCard, FeatureTitle, PlatformInset, TimeWindow } from "./Graphics";
import { BoxIcon, CrossIcon, HeartIcon, RepeatIcon, TrendingUpIcon, WifiIcon } from "./Icons";

const FPS = 30;
const sec = (s: number) => Math.round((s / SPEED) * FPS);

// Narrower than the overlay column so a caption still fits beneath the card.
const INSET_WIDTH = 880;

const badge = (Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>) => (
  <IconBadge>
    <Icon size={30} color={brand.colors.white} strokeWidth={2.3} />
  </IconBadge>
);

const outlineBadge = (Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>) => (
  <IconBadge tone="outline">
    <Icon size={30} color={brand.colors.white} strokeWidth={2.1} />
  </IconBadge>
);

/**
 * ABERTURA — "E se, das três às quatro da tarde, quem estivesse conectado na
 * sua loja recebesse um cupom?" The voucher is the only thing on screen, landing
 * once she has set up the hour and holding to the end of the question.
 */
export const Abertura: React.FC = () => (
  <Scene clip={clipById["abertura"]} nameCard="Vanessa Furiato">
    <Cue at={4.2} dur={7.2}>
      <OverlayStack>
        <CouponCard size={1.35} />
      </OverlayStack>
    </Cue>
  </Scene>
);

/**
 * DESENVOLVIMENTO 1 — names the tool, shows the coupon being built in the
 * platform, then the window logic that decides who receives it.
 */
export const Desenvolvimento1: React.FC = () => (
  <Scene clip={clipById["desenvolvimento-1"]}>
    <Cue at={0.4} dur={5.2}>
      <OverlayStack>
        <FeatureTitle />
      </OverlayStack>
    </Cue>

    <Cue at={5.9} dur={7.3}>
      <OverlayStack>
        <Eyebrow>Monte o cupom</Eyebrow>
        <PlatformInset
          src="hora-premiada/anim-cupom.mp4"
          rate={1.12}
          width={INSET_WIDTH}
          delay={sec(0.3)}
        />
      </OverlayStack>
    </Cue>

    <Cue at={13.3} dur={5.8}>
      <OverlayStack>
        <TimeWindow />
        <Chip icon={badge(WifiIcon)} delay={sec(2.8)}>
          entrega a quem está conectado
        </Chip>
      </OverlayStack>
    </Cue>
  </Scene>
);

/**
 * DESENVOLVIMENTO 2 — three uses, then the three things it spares the team,
 * then the automation payoff, proved by the campaign screen. The clip's own
 * pauses at ~5.5 s and ~12.2 s are the seams between those beats.
 */
export const Desenvolvimento2: React.FC = () => (
  <Scene clip={clipById["desenvolvimento-2"]}>
    <Cue at={0.2} dur={5.4}>
      <OverlayStack>
        <Eyebrow>Pode ser usado para</Eyebrow>
        <Chip icon={badge(TrendingUpIcon)}>Movimentar o horário parado</Chip>
        <Chip icon={badge(BoxIcon)} delay={sec(1.4)}>
          Girar um estoque específico
        </Chip>
        <Chip icon={badge(HeartIcon)} delay={sec(2.8)}>
          Reconhecer o cliente recorrente
        </Chip>
      </OverlayStack>
    </Cue>

    <Cue at={5.9} dur={4.8}>
      <OverlayStack>
        <Chip icon={outlineBadge(CrossIcon)} muted>
          sem promotor
        </Chip>
        <Chip icon={outlineBadge(CrossIcon)} delay={sec(1.2)} muted>
          sem panfleto
        </Chip>
        <Chip icon={outlineBadge(CrossIcon)} delay={sec(2.4)} muted>
          sem esforço da equipe
        </Chip>
      </OverlayStack>
    </Cue>

    {/* The campaign screen runs under the whole automation line, with the
        caption landing as she says it. */}
    <Cue at={10.9} dur={9.8}>
      <OverlayStack>
        <Eyebrow>Crie a campanha</Eyebrow>
        <PlatformInset
          src="hora-premiada/anim-campanha.mp4"
          rate={1.05}
          width={INSET_WIDTH}
          delay={sec(0.3)}
        />
        <Chip icon={badge(RepeatIcon)} delay={sec(1.7)}>
          Configura uma vez. Roda sozinha.
        </Chip>
      </OverlayStack>
    </Cue>
  </Scene>
);

/** FECHAMENTO, first half — the lockup once more, and nothing competing with it. */
export const FechamentoA: React.FC = () => (
  <Scene clip={clipById["fechamento-a"]}>
    <Cue at={0.4} dur={6.2}>
      <OverlayStack>
        <FeatureTitle />
      </OverlayStack>
    </Cue>
  </Scene>
);

/**
 * FECHAMENTO, second half — picks up after the fumbled line is cut out. Left
 * clean: she delivers the last line to camera and the end card takes the call
 * to action.
 */
export const FechamentoB: React.FC = () => <Scene clip={clipById["fechamento-b"]} />;
