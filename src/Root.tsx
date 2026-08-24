import "./index.css";
import { MyComposition } from "./institucional/Composition";
import { CartoriosComposition } from "./cartorios/Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <CartoriosComposition />
    </>
  );
};
