import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { wispot, font } from "../brand";
import { BrandBackdrop } from "../ui";

const BARS = [0.42, 0.58, 0.5, 0.72, 0.86, 1, 0.64];
const DAYS = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

const Tile: React.FC<{
  label: string;
  value: string;
  unit?: string;
  progress: number;
  highlight?: number;
}> = ({ label, value, unit, progress, highlight = 0 }) => (
  <div
    style={{
      flex: 1,
      background: highlight > 0.02 ? "#e9f6fd" : wispot.white,
      borderRadius: 30,
      padding: "30px 26px",
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [26, 0])}px) scale(${1 + 0.03 * highlight})`,
      border: `4px solid ${highlight > 0.02 ? wispot.blue : "transparent"}`,
      position: "relative",
    }}
  >
    {highlight > 0.02 ? (
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: 12,
          padding: "8px 18px",
          borderRadius: 999,
          background: wispot.blue,
          fontFamily: font,
          fontWeight: 800,
          fontSize: 21,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: wispot.white,
          transform: `scale(${0.7 + 0.3 * highlight})`,
          boxShadow: "0 8px 22px rgba(6,42,58,0.28)",
        }}
      >
        nova resposta
      </div>
    ) : null}
    <div
      style={{
        fontFamily: font,
        fontWeight: 700,
        fontSize: 26,
        lineHeight: 1.2,
        letterSpacing: 0.4,
        color: wispot.gray,
        minHeight: 66,
      }}
    >
      {label}
    </div>
    <div
      style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 10 }}
    >
      <div
        style={{
          fontFamily: font,
          fontWeight: 800,
          fontSize: 62,
          letterSpacing: -1.3,
          color: wispot.ink,
        }}
      >
        {value}
      </div>
      {unit ? (
        <div
          style={{
            fontFamily: font,
            fontWeight: 700,
            fontSize: 26,
            color: wispot.gray,
          }}
        >
          {unit}
        </div>
      ) : null}
    </div>
  </div>
);

/** Insert: o feedback caindo no painel junto com os dados que a rede já captura. */
export const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const at = (delay: number, damping = 18) =>
    spring({ frame: frame - delay, fps, config: { damping, mass: 0.8 } });

  const panel = at(0, 20);
  const tiles = [at(20), at(30), at(40)];
  const chart = at(58);
  const bars = interpolate(frame, [62, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const highlight = interpolate(frame, [100, 116, 168, 182], [0, 1, 1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flow = at(126);

  const exit = interpolate(
    frame,
    [durationInFrames - 9, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <BrandBackdrop deep />

      <div
        style={{
          position: "absolute",
          top: 132,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [4, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            padding: "16px 36px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.16)",
            border: "1.5px solid rgba(255,255,255,0.32)",
            fontFamily: font,
            fontWeight: 700,
            fontSize: 33,
            letterSpacing: 1.6,
            textTransform: "uppercase",
            color: wispot.white,
          }}
        >
          Tudo no mesmo painel
        </div>
      </div>

      <AbsoluteFill
        style={{ padding: "250px 52px 160px", justifyContent: "center" }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.13)",
            border: "1.5px solid rgba(255,255,255,0.24)",
            borderRadius: 44,
            padding: 40,
            opacity: panel,
            transform: `translateY(${interpolate(panel, [0, 1], [40, 0])}px) scale(${interpolate(panel, [0, 1], [0.96, 1])})`,
          }}
        >
          {/* Cabeçalho do painel */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <Img
              src={staticFile(wispot.logo.iconWhite)}
              style={{ width: 62 }}
            />
            <div
              style={{
                fontFamily: font,
                fontWeight: 800,
                fontSize: 46,
                letterSpacing: -0.6,
                color: wispot.white,
              }}
            >
              Plataforma Wispot
            </div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.16)",
                fontFamily: font,
                fontWeight: 700,
                fontSize: 24,
                color: wispot.white,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: "#4ade80",
                }}
              />
              ao vivo
            </div>
          </div>

          <div style={{ display: "flex", gap: 18 }}>
            <Tile
              label="Frequência de visita"
              value="3,4"
              unit="x/mês"
              progress={tiles[0]}
            />
            <Tile
              label="Tempo de permanência"
              value="42"
              unit="min"
              progress={tiles[1]}
            />
            <Tile
              label="Satisfação · WiQuest"
              value="4,7"
              unit="/5"
              progress={tiles[2]}
              highlight={highlight}
            />
          </div>

          {/* Gráfico de visitas */}
          <div
            style={{
              marginTop: 36,
              background: wispot.white,
              borderRadius: 30,
              padding: "30px 32px 26px",
              opacity: chart,
              transform: `translateY(${interpolate(chart, [0, 1], [24, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: font,
                fontWeight: 700,
                fontSize: 27,
                letterSpacing: 0.4,
                color: wispot.gray,
              }}
            >
              Visitas por dia da semana
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 16,
                height: 330,
                marginTop: 26,
              }}
            >
              {BARS.map((b, i) => {
                const grow = interpolate(
                  bars,
                  [i * 0.07, 0.55 + i * 0.07],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                );
                return (
                  <div
                    key={DAYS[i]}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        height: 278,
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: `${b * grow * 100}%`,
                          borderRadius: 12,
                          background:
                            i === 5
                              ? wispot.blue
                              : `rgba(37,168,224,${0.28 + 0.12 * (i % 3)})`,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        fontFamily: font,
                        fontWeight: 700,
                        fontSize: 25,
                        color: wispot.gray,
                      }}
                    >
                      {DAYS[i]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Opinião + comportamento */}
          <div
            style={{
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: flow,
              transform: `translateY(${interpolate(flow, [0, 1], [18, 0])}px)`,
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "20px 24px",
                borderRadius: 22,
                background: "rgba(255,255,255,0.18)",
                fontFamily: font,
                fontWeight: 800,
                fontSize: 34,
                color: wispot.white,
                textAlign: "center",
              }}
            >
              Opinião do cliente
            </div>
            <div
              style={{
                fontFamily: font,
                fontWeight: 800,
                fontSize: 38,
                color: wispot.white,
              }}
            >
              +
            </div>
            <div
              style={{
                flex: 1,
                padding: "20px 24px",
                borderRadius: 22,
                background: "rgba(255,255,255,0.18)",
                fontFamily: font,
                fontWeight: 800,
                fontSize: 34,
                color: wispot.white,
                textAlign: "center",
              }}
            >
              Dados da rede
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 22,
            textAlign: "center",
            fontFamily: font,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 1.4,
            color: "rgba(255,255,255,0.5)",
            opacity: panel,
          }}
        >
          Painel ilustrativo
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
