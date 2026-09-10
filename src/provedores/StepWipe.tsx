import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { fontFamily } from "../loadFont";
import { wispot } from "./theme";
import { blockRanges, blocks } from "./content";

/** Metade da janela da passagem: o corte cai no quadro em que o painel cobre tudo. */
const METADE = 6;

const ease = Easing.inOut(Easing.cubic);

/**
 * Passagem da marca sobre cada troca de take.
 *
 * Os takes têm todos o mesmo enquadramento, então um corte exposto faz a cena
 * parecer que voltou atrás. O painel cobre o quadro exatamente no corte.
 */
export const StepWipe: React.FC = () => {
  const frame = useCurrentFrame();

  const corte = blockRanges
    .map((r, i) => ({ frame: r.start, bloco: blocks[i] }))
    .filter((c) => c.frame > 0)
    .find((c) => Math.abs(frame - c.frame) <= METADE);

  if (!corte) return null;

  const p = interpolate(frame, [corte.frame - METADE, corte.frame + METADE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = p < 0.5
    ? interpolate(ease(p * 2), [0, 1], [-106, 0])
    : interpolate(ease((p - 0.5) * 2), [0, 1], [0, 106]);

  const passo = corte.bloco.activeSteps.length === 1 ? corte.bloco.activeSteps[0] : null;
  const conteudo = interpolate(p, [0.25, 0.5, 0.75], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: wispot.cyan,
          transform: `translateX(${x}%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: conteudo }}>
          <Img src={staticFile(wispot.logo.white)} style={{ width: 300 }} />
          {passo ? (
            <div
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: 120,
                lineHeight: 1,
                color: wispot.white,
                letterSpacing: -2,
              }}
            >
              {String(passo).padStart(2, "0")}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
