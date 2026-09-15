import { yt } from "./theme";

export const PlayBadge: React.FC<{ width?: number; radius?: number }> = ({
  width = 120,
  radius = 0.24,
}) => {
  const height = width * 0.7;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * radius,
        background: yt.colors.play,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 18px 50px rgba(255,59,48,0.35)",
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          marginLeft: width * 0.06,
          borderTop: `${height * 0.22}px solid transparent`,
          borderBottom: `${height * 0.22}px solid transparent`,
          borderLeft: `${height * 0.38}px solid ${yt.colors.white}`,
        }}
      />
    </div>
  );
};
