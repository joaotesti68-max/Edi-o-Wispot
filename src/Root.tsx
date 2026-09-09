import "./index.css";
import { MyComposition } from "./Composition";
import { LogisticaComposition } from "./CompositionLogistica";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LogisticaComposition />
    </>
  );
};
