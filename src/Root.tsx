import "./index.css";
import { MyComposition } from "./Composition";
import { WiQuestComposition } from "./wiquest/WiQuestVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <WiQuestComposition />
    </>
  );
};
