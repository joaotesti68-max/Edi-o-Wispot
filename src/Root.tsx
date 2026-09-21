import "./index.css";
import { MyComposition } from "./Composition";
import { BackupComposition } from "./backup/BackupComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <BackupComposition />
    </>
  );
};
