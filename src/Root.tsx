import "./index.css";
import { MyComposition } from "./Composition";
import { WifiComposition } from "./wifi/WifiVideo";
import { QaComposition } from "./qa/QaVideo";
import { WiquestComposition } from "./wiquest/WiquestVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <WifiComposition />
      <QaComposition />
      <WiquestComposition />
    </>
  );
};
