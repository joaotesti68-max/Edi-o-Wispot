import "./index.css";
import { MyComposition } from "./Composition";
import { FeatureDaSemanaComposition } from "./wispot/FeatureDaSemana";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <FeatureDaSemanaComposition />
    </>
  );
};
