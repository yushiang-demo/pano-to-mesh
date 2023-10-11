import { useEffect, useState } from "react";
import { getModal } from "../../helpers/MediaLoader";

const GLBModal = ({ three, position, scale, quaternion, data }) => {
  const [mesh, setMesh] = useState(null);
  useEffect(() => {
    getModal(data).then(setMesh);
  }, [data]);

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

export default GLBModal;
