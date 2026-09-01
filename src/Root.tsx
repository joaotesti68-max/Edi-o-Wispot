import "./index.css";
import { MyComposition } from "./Composition";
import { JoaoCompositions } from "./joao/Compositions";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <JoaoCompositions />
    </>
  );
};
