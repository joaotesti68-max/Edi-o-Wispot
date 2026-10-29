import "./index.css";
import { MyComposition } from "./Composition";
import { WifiComposition } from "./wifi/WifiVideo";
import { QaComposition } from "./qa/QaVideo";
import { EndpointComposition } from "./endpoint/EndpointVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <WifiComposition />
      <QaComposition />
      <EndpointComposition />
    </>
  );
};
