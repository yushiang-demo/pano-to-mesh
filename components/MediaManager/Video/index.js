import { Video } from "./styled";

const VideoContainer = ({ src }) => {
  return (
    <Video controls autoPlay loop>
      <source src={src} type="video/mp4" />
    </Video>
  );
};

export default VideoContainer;
