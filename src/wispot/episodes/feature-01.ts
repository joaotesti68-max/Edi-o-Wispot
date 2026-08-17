import { distributeCaptions, type Episode } from "../series";

const ABERTURA_FRAMES = 468;
const DESENVOLVIMENTO_FRAMES = 605;
const FECHAMENTO_FRAMES = 357;

export const feature01: Episode = {
  seriesLabel: "FEATURE DA SEMANA",
  episodeNumber: 1,
  episodeTitle: "Como funciona a tela de conexão",
  blocks: [
    {
      id: "abertura",
      video: "videos/feature-01-abertura.mp4",
      durationInFrames: ABERTURA_FRAMES,
      kicker: "Feature da semana #01",
      captions: distributeCaptions(
        [
          "Esse é o primeiro vídeo da nossa série Feature da Semana.",
          "Toda semana, eu vou apresentar um recurso da Wispot e explicar exatamente como ele funciona.",
          "Hoje: a tela que aparece quando o cliente se conecta ao seu Wi-Fi.",
        ],
        ABERTURA_FRAMES,
      ),
    },
    {
      id: "desenvolvimento",
      video: "videos/feature-01-desenvolvimento.mp4",
      durationInFrames: DESENVOLVIMENTO_FRAMES,
      kicker: "Como funciona",
      termBadge: { text: "CAPTIVE PORTAL", appearFrame: 18 },
      captions: distributeCaptions(
        [
          "Essa tela se chama Captive Portal.",
          "Ela é personalizada com a identidade visual da sua marca, e você escolhe como o cliente faz login: pelo Facebook, Google, número de celular ou e-mail.",
          "Enquanto a conexão carrega, você também pode exibir uma promoção, pedir uma avaliação no Google ou fazer uma pergunta rápida,",
          "tudo isso sem que o cliente precise baixar nenhum aplicativo.",
        ],
        DESENVOLVIMENTO_FRAMES,
      ),
    },
    {
      id: "fechamento",
      video: "videos/feature-01-fechamento.mp4",
      durationInFrames: FECHAMENTO_FRAMES,
      kicker: "Por que isso importa",
      captions: distributeCaptions(
        [
          "Essa tela simples é o ponto de partida de tudo que a Wispot oferece.",
          "Na próxima semana, eu explico o que acontece com esse dado depois que o cliente conecta.",
        ],
        FECHAMENTO_FRAMES,
      ),
    },
  ],
  endCard: {
    tagline: "Toda semana, um recurso novo.",
    teaserLabel: "Semana que vem",
    teaserText: "O que acontece com o dado do cliente depois que ele conecta",
  },
};
