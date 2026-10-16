import "./index.css";
import { MyComposition } from "./Composition";
import { WifiComposition } from "./wifi/WifiVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <WifiComposition />
    </>
  );
};
