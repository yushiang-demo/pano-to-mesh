import * as THREE from "three";
import ChromaKeyPanel from "../Core";
import { useState, useEffect, useRef } from "react";

const Video = ({ data, ...props }) => {
  const videoRef = useRef(null);
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const texture = new THREE.VideoTexture(videoRef.current);
    setTexture(texture);
    videoRef.current.load();
    return () => {
      texture.dispose();
    };
  }, [data]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        style={{ visibility: "hidden" }}
      >
        <source src={data.src} type="video/mp4" />
      </video>
      <ChromaKeyPanel {...props} texture={texture} color={data.color} />
    </>
  );
};

export default Video;
