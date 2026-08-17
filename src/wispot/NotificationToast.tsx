import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "./brand";

const SLIDE_OUT = 10;

// A phone push-notification banner sliding in from the top — used to
// dramatize the things Wispot can surface while a customer's connection
// loads (promo, review request, quick question) over the login demo.
export const NotificationToast: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  appearFrame: number;
  durationFrames: number;
}> = ({ icon, title, subtitle, appearFrame, durationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - appearFrame;

  if (localFrame < -5 || localFrame > durationFrames + SLIDE_OUT) return null;

  const slideIn = spring({ frame: localFrame, fps, config: { damping: 16, mass: 0.7 } });
  const slideOutProgress = interpolate(localFrame, [durationFrames, durationFrames + SLIDE_OUT], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shiftIn = interpolate(slideIn, [0, 1], [-160, 0]);
  const shiftOut = interpolate(slideOutProgress, [0, 1], [0, -160]);
  const opacity = interpolate(slideOutProgress, [0, 1], [1, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 168,
        left: 64,
        right: 64,
        opacity,
        transform: `translateY(${shiftIn + shiftOut}px)`,
        background: "rgba(255,255,255,0.97)",
        borderRadius: 20,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          flexShrink: 0,
          borderRadius: 13,
          background: brand.colors.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 800,
            fontSize: 24,
            color: brand.colors.gray,
            letterSpacing: -0.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: brand.fontFamily,
            fontWeight: 500,
            fontSize: 20,
            color: brand.colors.gray,
            opacity: 0.75,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          marginLeft: "auto",
          fontFamily: brand.fontFamily,
          fontWeight: 600,
          fontSize: 16,
          color: brand.colors.gray,
          opacity: 0.5,
          flexShrink: 0,
        }}
      >
        agora
      </div>
    </div>
  );
};
