import React from "react";
import { brand } from "./brand";
import { clipById } from "./content";
import { Scene } from "./Scene";
import { Chip, Cue, Eyebrow, Headline, IconBadge, OverlayStack } from "./Ui";
import { AutoLoop, CouponCard, FeatureTitle, TimeWindow } from "./Graphics";
import {
  BoxIcon,
  ChatIcon,
  ClockIcon,
  CrossIcon,
  HeartIcon,
  SparkIcon,
  TrendingUpIcon,
  WifiIcon,
} from "./Icons";

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

const badge = (Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>) => (
  <IconBadge>
    <Icon size={32} color={brand.colors.white} strokeWidth={2.2} />
  </IconBadge>
);

/**
 * ABERTURA — "E se, das três às quatro da tarde, quem estivesse conectado na
 * sua loja recebesse um cupom?" One continuous take, so the three ideas of the
 * question build up on screen instead of replacing each other.
 */
export const Abertura: React.FC = () => (
  <Scene clip={clipById["abertura"]} nameCard="Vanessa Furiato">
    <Cue at={1.2} dur={10.2}>
      <OverlayStack>
        <Chip icon={badge(ClockIcon)}>das 15h às 16h</Chip>
        <Chip icon={badge(WifiIcon)} delay={sec(3.2)}>
          quem está conectado na loja
        </Chip>
        <div style={{ marginTop: 10 }}>
          <CouponCard delay={sec(6.7)} />
        </div>
      </OverlayStack>
    </Cue>
  </Scene>
);

/**
 * DESENVOLVIMENTO 1 — names the tool, then shows the two things the platform
 * does: you set the window, it delivers to whoever is connected inside it.
 */
export const Desenvolvimento1: React.FC = () => (
  <Scene clip={clipById["desenvolvimento-1"]}>
    <Cue at={0.4} dur={7.4}>
      <OverlayStack>
        <FeatureTitle />
      </OverlayStack>
    </Cue>

    <Cue at={8.0} dur={5.2}>
      <OverlayStack>
        <Chip icon={badge(SparkIcon)}>Promoções automatizadas</Chip>
      </OverlayStack>
    </Cue>

    <Cue at={13.3} dur={5.9}>
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
 * then the automation payoff. The clip's own pauses at ~5.5 s and ~12.2 s are
 * the seams between those beats.
 */
export const Desenvolvimento2: React.FC = () => (
  <Scene clip={clipById["desenvolvimento-2"]}>
    <Cue at={0.2} dur={5.4}>
      <OverlayStack>
        <Eyebrow>Serve para</Eyebrow>
        <Chip icon={badge(TrendingUpIcon)}>Movimentar o horário parado</Chip>
        <Chip icon={badge(BoxIcon)} delay={sec(1.4)}>
          Girar um estoque específico
        </Chip>
        <Chip icon={badge(HeartIcon)} delay={sec(2.8)}>
          Reconhecer o cliente recorrente
        </Chip>
      </OverlayStack>
    </Cue>

    <Cue at={5.9} dur={6.3}>
      <OverlayStack>
        <Chip icon={badge(CrossIcon)} muted>
          sem promotor
        </Chip>
        <Chip icon={badge(CrossIcon)} delay={sec(1.3)} muted>
          sem panfleto
        </Chip>
        <Chip icon={badge(CrossIcon)} delay={sec(2.6)} muted>
          sem esforço da equipe
        </Chip>
      </OverlayStack>
    </Cue>

    <Cue at={12.6} dur={8.1}>
      <OverlayStack>
        <AutoLoop />
        <Chip icon={badge(ClockIcon)} delay={sec(3.0)}>
          no momento certo
        </Chip>
      </OverlayStack>
    </Cue>
  </Scene>
);

/** FECHAMENTO, first half — the lockup once more, then the promise. */
export const FechamentoA: React.FC = () => (
  <Scene clip={clipById["fechamento-a"]}>
    <Cue at={0.4} dur={3.8}>
      <OverlayStack>
        <FeatureTitle />
      </OverlayStack>
    </Cue>

    <Cue at={4.6} dur={3.53}>
      <OverlayStack>
        <Headline size={58}>Gire seu horário mais parado em vendas.</Headline>
      </OverlayStack>
    </Cue>
  </Scene>
);

/** FECHAMENTO, second half — picks up after the fumbled line is cut out. */
export const FechamentoB: React.FC = () => (
  <Scene clip={clipById["fechamento-b"]}>
    <Cue at={0.2} dur={3.4}>
      <OverlayStack>
        <Chip icon={badge(ChatIcon)}>Fale com a gente</Chip>
      </OverlayStack>
    </Cue>
  </Scene>
);
