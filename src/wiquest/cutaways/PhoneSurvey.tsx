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
import { BrandBackdrop, CheckIcon, PhoneFrame, WifiArcs } from "../ui";

const Star: React.FC<{ filled: boolean; size?: number }> = ({
  filled,
  size = 68,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2.6 L14.9 8.9 L21.6 9.7 L16.7 14.3 L18 21 L12 17.7 L6 21 L7.3 14.3 L2.4 9.7 L9.1 8.9 Z"
      fill={filled ? "#f5b301" : "none"}
      stroke={filled ? "#f5b301" : "#ccd5da"}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  </svg>
);

const PHONE_W = 560;
const PHONE_H = 1200;
const SHEET_H = 720;

/** Insert: a pergunta acontecendo dentro da própria tela de conexão do Wi-Fi. */
export const PhoneSurvey: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.9 } });
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const sheet = spring({
    frame: frame - 32,
    fps,
    config: { damping: 19, mass: 0.8 },
  });
  const tap = spring({
    frame: frame - 66,
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const tapRing = interpolate(frame, [60, 68, 82, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stars = interpolate(frame, [72, 88], [0, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sent = frame >= 102;
  const sentIn = spring({ frame: frame - 102, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <BrandBackdrop deep>
        <div
          style={{
            position: "absolute",
            top: 210,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.13,
          }}
        >
          <WifiArcs size={1500} color={wispot.white} dot />
        </div>
      </BrandBackdrop>

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
          A pergunta dentro do Wi-Fi
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 268,
          left: "50%",
          transform: `translateX(-50%) translateY(${interpolate(enter, [0, 1], [120, 0])}px) scale(${interpolate(enter, [0, 1], [0.95, 1])})`,
          opacity: enter,
        }}
      >
        <PhoneFrame width={PHONE_W} height={PHONE_H}>
          {/* Tela de conexão ao Wi-Fi */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "96px 44px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              background: "linear-gradient(180deg, #eaf7fd 0%, #ffffff 46%)",
            }}
          >
            <Img src={staticFile(wispot.logo.color)} style={{ width: 250 }} />
            <div
              style={{
                fontFamily: font,
                fontWeight: 700,
                fontSize: 28,
                color: wispot.gray,
              }}
            >
              Wi-Fi grátis · Loja Centro
            </div>
            <Img
              src={staticFile(wispot.logo.iconColor)}
              style={{ width: 150, marginTop: 26 }}
            />
            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: font,
                fontWeight: 800,
                fontSize: 32,
                color: wispot.ink,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: "#1c8f5a",
                }}
              />
              Conectado
            </div>
          </div>

          {/* Scrim do bottom sheet */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(6,42,58,0.32)",
              opacity: sheet,
            }}
          />

          {/* Card da pesquisa */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: SHEET_H,
              borderTopLeftRadius: 46,
              borderTopRightRadius: 46,
              background: wispot.white,
              boxShadow: "0 -20px 50px rgba(6,42,58,0.28)",
              transform: `translateY(${interpolate(sheet, [0, 1], [SHEET_H + 20, 0])}px)`,
              padding: "32px 42px 40px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: 96,
                height: 7,
                borderRadius: 4,
                background: "#dde5ea",
                alignSelf: "center",
                marginBottom: 30,
              }}
            />
            <div
              style={{
                fontFamily: font,
                fontWeight: 700,
                fontSize: 25,
                letterSpacing: 2.2,
                textTransform: "uppercase",
                color: wispot.blue,
                marginBottom: 14,
              }}
            >
              WiQuest
            </div>
            <div
              style={{
                fontFamily: font,
                fontWeight: 800,
                fontSize: 50,
                lineHeight: 1.12,
                letterSpacing: -0.9,
                color: wispot.ink,
              }}
            >
              Como foi sua visita hoje?
            </div>

            <div
              style={{
                position: "relative",
                display: "flex",
                gap: 12,
                marginTop: 46,
                justifyContent: "space-between",
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} filled={stars > i} size={72} />
              ))}
              {/* Toque do cliente na última estrela */}
              <div
                style={{
                  position: "absolute",
                  right: 36,
                  top: 36,
                  width: 104,
                  height: 104,
                  marginRight: -52,
                  marginTop: -52,
                  borderRadius: 999,
                  border: `5px solid ${wispot.blue}`,
                  background: "rgba(37,168,224,0.2)",
                  opacity: tapRing,
                  transform: `scale(${interpolate(tap, [0, 1], [1.6, 1])})`,
                }}
              />
            </div>

            <div style={{ flex: 1 }} />

            <div
              style={{
                height: 102,
                borderRadius: 24,
                background: sent ? "#1c8f5a" : wispot.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                fontFamily: font,
                fontWeight: 800,
                fontSize: 38,
                color: wispot.white,
                transform: `scale(${sent ? interpolate(sentIn, [0, 1], [0.95, 1]) : 1})`,
              }}
            >
              {sent ? <CheckIcon size={36} strokeWidth={3.4} /> : null}
              {sent ? "Resposta enviada" : "Enviar"}
            </div>
            <div
              style={{
                marginTop: 20,
                textAlign: "center",
                fontFamily: font,
                fontWeight: 700,
                fontSize: 24,
                color: "#93a0a7",
              }}
            >
              Sem baixar aplicativo
            </div>
          </div>
        </PhoneFrame>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 132,
          left: 0,
          right: 0,
          padding: "0 70px",
          textAlign: "center",
          fontFamily: font,
          fontWeight: 800,
          fontSize: 42,
          letterSpacing: -0.4,
          color: wispot.white,
          opacity: interpolate(frame, [96, 112], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        No momento em que o cliente ainda está aí
      </div>
    </AbsoluteFill>
  );
};
