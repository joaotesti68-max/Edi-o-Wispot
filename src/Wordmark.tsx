import { Img, staticFile } from "remotion";
import { brand } from "./brand";

/** Proporção do PNG oficial já aparado (1912x897). */
const RATIO = 1912 / 897;

export const Wordmark: React.FC<{ height?: number; variant?: "white" | "color" }> = ({
  height = 56,
  variant = "white",
}) => (
  <Img
    src={staticFile(brand.logo[variant])}
    style={{ height, width: height * RATIO, display: "block" }}
  />
);
