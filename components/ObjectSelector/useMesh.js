import { useState, useEffect } from "react";
import { Media } from "@pano-to-mesh/three";
import { MEDIA_2D, MEDIA_3D } from "../MediaManager/types";

const useMesh = ({ type, data, transformation, updateRaycasterMesh }) => {
  const [mesh, setMesh] = useState(null);
  useEffect(() => {
    const getMesh = async (type) => {
      if (type === MEDIA_3D.PLACEHOLDER_3D) {
        return Media.getBoxMesh();
      } else if (type === MEDIA_3D.MODEL) {
        return await Media.getModal({ src: data.src });
      } else if (Object.values(MEDIA_2D).includes(type)) {
        return Media.getPlaneMesh();
      }
    };

    getMesh(type).then(setMesh);
  }, [type, data.src]);

  useEffect(() => {
    if (!mesh) return;
    mesh.setTransform(transformation);
    updateRaycasterMesh(mesh);

    return () => {
      updateRaycasterMesh(null);
    };
  }, [mesh, transformation, updateRaycasterMesh]);

  return mesh;
};

export default useMesh;
