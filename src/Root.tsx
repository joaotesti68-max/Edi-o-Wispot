import "./index.css";
import { MyComposition } from "./Composition";
import { HoraPremiadaComposition } from "./hora-premiada/Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <HoraPremiadaComposition />
    </>
  );
};
