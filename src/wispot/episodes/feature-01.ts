import { distributeCaptions, type Episode } from "../series";

// Each clip has dead air at its head/tail (breaths, pauses before/after
// the take) — trimmed via trimBefore/trimAfter so cuts between blocks
// land on speech instead of silence. Boundaries found with
// `ffmpeg -af silencedetect`. Note feature-01-fechamento.mp4's container
// only has ~14.585s of decodable video despite reporting 357 frames'
// worth of duration at 24fps — 350 is the real, playable frame count.
//
// Remotion's trimBefore/trimAfter are absolute source-frame positions
// (trimAfter is where playback stops, not a duration cut from the end),
// so the *_TAIL_SILENCE constants below get converted to an absolute
// trimAfter at the point they're used.
const ABERTURA_SOURCE_FRAMES = 468;
const ABERTURA_TRIM_BEFORE = 28; // ~1.17s leading silence
const ABERTURA_TAIL_SILENCE = 15; // ~0.63s trailing silence
const ABERTURA_TRIM_AFTER = ABERTURA_SOURCE_FRAMES - ABERTURA_TAIL_SILENCE;
const ABERTURA_FRAMES = ABERTURA_TRIM_AFTER - ABERTURA_TRIM_BEFORE;

const DESENVOLVIMENTO_SOURCE_FRAMES = 605;
const DESENVOLVIMENTO_TRIM_BEFORE = 27; // ~1.13s leading silence
const DESENVOLVIMENTO_TAIL_SILENCE = 17; // ~0.71s trailing silence
const DESENVOLVIMENTO_TRIM_AFTER = DESENVOLVIMENTO_SOURCE_FRAMES - DESENVOLVIMENTO_TAIL_SILENCE;
const DESENVOLVIMENTO_FRAMES = DESENVOLVIMENTO_TRIM_AFTER - DESENVOLVIMENTO_TRIM_BEFORE;

const FECHAMENTO_SOURCE_FRAMES = 350;
const FECHAMENTO_TAIL_SILENCE = 31; // ~1.3s trailing silence
const FECHAMENTO_TRIM_AFTER = FECHAMENTO_SOURCE_FRAMES - FECHAMENTO_TAIL_SILENCE;
const FECHAMENTO_FRAMES = FECHAMENTO_TRIM_AFTER;

// Login demo clip: 22s native at 30fps, held on its last frame for the
// remaining ~3.2s of narration once the Vanessa audio track runs long.
const LOGIN_DEMO_FREEZE_FRAME = 528;

export const feature01: Episode = {
  seriesLabel: "FEATURE DA SEMANA",
  episodeNumber: 1,
  episodeTitle: "Como funciona a tela de conexão",
  blocks: [
    {
      id: "abertura",
      video: "videos/feature-01-abertura.mp4",
      durationInFrames: ABERTURA_FRAMES,
      trimBefore: ABERTURA_TRIM_BEFORE,
      trimAfter: ABERTURA_TRIM_AFTER,
      nameCard: { name: "Vanessa Furiato", role: "Gerente Comercial" },
      captions: distributeCaptions(
        [
          "Esse é o primeiro vídeo",
          "da nossa série Feature da Semana.",
          "Toda semana, eu vou apresentar um recurso da Wispot",
          "e explicar exatamente como ele funciona.",
          "Hoje: a tela que aparece",
          "quando o cliente se conecta ao seu Wi-Fi.",
        ],
        ABERTURA_FRAMES,
      ),
    },
    (() => {
      const captions = distributeCaptions(
        [
          "Essa tela se chama",
          "Captive Portal.",
          "Ela é personalizada com a identidade visual da sua marca,",
          "e você escolhe como o cliente faz login:",
          "pelo Facebook, Google,",
          "número de celular ou e-mail.",
          "Enquanto a conexão carrega,",
          "você também pode exibir uma promoção,",
          "pedir uma avaliação no Google",
          "ou fazer uma pergunta rápida,",
          "tudo isso sem que o cliente",
          "precise baixar nenhum aplicativo.",
        ],
        DESENVOLVIMENTO_FRAMES,
      );
      // Indices 7-9 are the "promoção / avaliação / pergunta rápida" lines —
      // each gets a push-notification mockup timed to its caption.
      return {
        id: "desenvolvimento",
        video: "videos/feature-01-desenvolvimento.mp4",
        durationInFrames: DESENVOLVIMENTO_FRAMES,
        trimBefore: DESENVOLVIMENTO_TRIM_BEFORE,
        trimAfter: DESENVOLVIMENTO_TRIM_AFTER,
        kicker: "Como funciona",
        demoVideo: { src: "videos/feature-01-login-demo.mp4", freezeAtFrame: LOGIN_DEMO_FREEZE_FRAME },
        captions,
        notifications: [
          {
            icon: "🎉",
            title: "Promoção",
            subtitle: "10% de desconto hoje",
            appearFrame: captions[7].startFrame,
            durationFrames: captions[7].endFrame - captions[7].startFrame + 30,
          },
          {
            icon: "⭐",
            title: "Avalie no Google",
            subtitle: "Conta pra gente como foi",
            appearFrame: captions[8].startFrame,
            durationFrames: captions[8].endFrame - captions[8].startFrame + 30,
          },
          {
            icon: "💬",
            title: "Pergunta rápida",
            subtitle: "Qual dessas opções você prefere?",
            appearFrame: captions[9].startFrame,
            durationFrames: captions[9].endFrame - captions[9].startFrame + 30,
          },
        ],
      };
    })(),
    {
      id: "fechamento",
      video: "videos/feature-01-fechamento.mp4",
      durationInFrames: FECHAMENTO_FRAMES,
      trimAfter: FECHAMENTO_TRIM_AFTER,
      kicker: "Por que isso importa",
      captions: distributeCaptions(
        [
          "Essa tela simples é o ponto de partida",
          "de tudo que a Wispot oferece.",
          "Na próxima semana, eu explico",
          "o que acontece com esse dado",
          "depois que o cliente conecta.",
        ],
        FECHAMENTO_FRAMES,
      ),
    },
  ],
  endCard: {
    teaserLabel: "Semana que vem",
    teaserText: "O que acontece com o dado do cliente depois que ele conecta",
  },
};
