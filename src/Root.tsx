import "./index.css";
import { MyComposition } from "./Composition";
import { ProvedoresComposition } from "./provedores/Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <ProvedoresComposition />
    </>
  );
};
