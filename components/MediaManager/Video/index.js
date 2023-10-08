import { useEffect, useRef } from "react";
import { Video } from "./styled";

const VideoContainer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.load();
  }, [src]);

  return (
    <Video controls autoPlay loop muted ref={videoRef}>
      <source src={src} type="video/mp4" />
    </Video>
  );
};

export default VideoContainer;
