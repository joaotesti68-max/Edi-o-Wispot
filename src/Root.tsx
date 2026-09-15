import "./index.css";
import { MyComposition } from "./Composition";
import { YoutubeCallComposition } from "./youtube/YoutubeCall";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <YoutubeCallComposition />
    </>
  );
};
