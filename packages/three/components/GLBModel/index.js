import { useEffect, useState } from "react";
import { getModal } from "../../helpers/MediaLoader";
import { useUpdateModel } from "../../hooks";

const GLBModel = ({ three, position, scale, quaternion, data }) => {
  const [mesh, setMesh] = useState(null);

  useEffect(() => {
    const { src } = data;
    getModal({ src }).then(setMesh);
  }, [data.src]);
  useUpdateModel(mesh, data);

  useEffect(() => {
    if (!mesh) return;

    const { scene } = three;
    scene.add(mesh.object);

    return () => {
      scene.remove(mesh.object);
      mesh.dispose();
    };
  }, [three, mesh]);

  useEffect(() => {
    if (!mesh) return;

    mesh.setTransform({ position, scale, quaternion });
  }, [mesh, position, scale, quaternion]);

  return null;
};

export default GLBModel;
