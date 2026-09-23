import "./index.css";
import { MyComposition } from "./Composition";
import { BackupComposition } from "./backup/BackupComposition";
import { WifiComposition } from "./wifi/WifiComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <BackupComposition />
      <WifiComposition />
    </>
  );
};
