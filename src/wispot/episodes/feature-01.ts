import { FPS, captionsFromTimestamps, type Episode } from "../series";

// Timing for every clip below comes from the real transcript the client
// provided (with "Westpot" -> "Wispot" and "Captive Bottle" -> "Captive
// Portal" corrected) cross-checked against `ffmpeg -af silencedetect`
// pause boundaries in each source file — not the original shooting
// script, which she didn't follow. All start/end values are seconds into
// the ORIGINAL, untrimmed source clip.
//
// Remotion's trimBefore/trimAfter are absolute source-frame positions
// (trimAfter is where playback stops, not a duration cut from the end).

// --- abertura: cut past her off-script opening line straight to
// "Toda semana estarei aqui com vocês..." (real onset ~5.54s; the
// client's own "0:06" estimate was rounded, so we go slightly earlier).
const ABERTURA_TRIM_BEFORE = 130; // 5.417s
const ABERTURA_TRIM_AFTER = 455; // 18.958s, just past her last word
const ABERTURA_FRAMES = ABERTURA_TRIM_AFTER - ABERTURA_TRIM_BEFORE;

const DESENVOLVIMENTO_TRIM_BEFORE = 26; // 1.083s
const DESENVOLVIMENTO_TRIM_AFTER = 590; // 24.583s
const DESENVOLVIMENTO_FRAMES = DESENVOLVIMENTO_TRIM_AFTER - DESENVOLVIMENTO_TRIM_BEFORE;

const FECHAMENTO_TRIM_AFTER = 323; // 13.458s, keeps "Não perca!" intact
const FECHAMENTO_FRAMES = FECHAMENTO_TRIM_AFTER;

// Login demo clip: 22s native at 30fps, held on its last frame for the
// remainder of the desenvolvimento block once the demo runs out.
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
      captions: captionsFromTimestamps(
        [
          { text: "Toda semana, eu estarei aqui com vocês", start: 5.535, end: 8.073 },
          { text: "para falar de uma funcionalidade nova que a Wispot traz.", start: 8.546, end: 11.933 },
          { text: "Hoje, o primeiro dia, a gente vai falar da Tela Login,", start: 12.432, end: 14.759 },
          { text: "a primeira tela personalizada do nosso Captive Portal.", start: 16.095, end: 18.921 },
        ],
        FPS,
        ABERTURA_TRIM_BEFORE,
        ABERTURA_FRAMES,
      ),
    },
    {
      id: "desenvolvimento",
      video: "videos/feature-01-desenvolvimento.mp4",
      durationInFrames: DESENVOLVIMENTO_FRAMES,
      trimBefore: DESENVOLVIMENTO_TRIM_BEFORE,
      trimAfter: DESENVOLVIMENTO_TRIM_AFTER,
      kicker: "Como funciona",
      demoVideo: { src: "videos/feature-01-login-demo.mp4", freezeAtFrame: LOGIN_DEMO_FREEZE_FRAME },
      captions: captionsFromTimestamps(
        [
          { text: "A Tela Login é a primeira tela de interação com o cliente.", start: 1.189, end: 4.817 },
          {
            text: "Nela, você personaliza a sua marca e escolhe as formas que ele vai se conectar.",
            start: 5.185,
            end: 9.654,
          },
          { text: "Entre elas, você tem Facebook, Google, LinkedIn, Twitter, X, Apple ID.", start: 10.188, end: 15.667 },
          {
            text: "E dentro dessas variedades de conexão, você escolhe os dados que você captar.",
            start: 16.052,
            end: 20.85,
          },
          { text: "Então, é a primeira interação do cliente com o seu negócio.", start: 20.85, end: 24.542 },
        ],
        FPS,
        DESENVOLVIMENTO_TRIM_BEFORE,
        DESENVOLVIMENTO_FRAMES,
      ),
    },
    {
      id: "fechamento",
      video: "videos/feature-01-fechamento.mp4",
      durationInFrames: FECHAMENTO_FRAMES,
      trimAfter: FECHAMENTO_TRIM_AFTER,
      kicker: "Por que isso importa",
      captions: captionsFromTimestamps(
        [
          {
            text: "A conexão do usuário é apenas o ponto de partida de tudo que a Wispot oferece.",
            start: 0,
            end: 5.13,
          },
          { text: "A semana que vem, eu volto aqui pra te contar", start: 5.663, end: 8.189 },
          {
            text: "o que acontece com a captação de dados e tudo mais que a gente pode te oferecer.",
            start: 8.457,
            end: 12.315,
          },
          { text: "Não perca!", start: 12.725, end: 13.361 },
        ],
        FPS,
        0,
        FECHAMENTO_FRAMES,
      ),
    },
  ],
  endCard: {
    teaserLabel: "Semana que vem",
    teaserText: "O que acontece com a captação de dados do cliente",
  },
};
