import { useEffect } from "react";
import { getBoxMesh, getPlaneMesh } from "../../helpers/MediaLoader";

const Placeholder = ({ three, position, scale, quaternion, getMesh }) => {
  useEffect(() => {
    const { scene } = three;

    const mesh = getMesh();
    mesh.setTransform({ position, scale, quaternion });
    scene.add(mesh.object);

    return () => {
      scene.remove(mesh.object);
      mesh.dispose();
    };
  }, [three, position, scale, quaternion]);

  return null;
};

export const Modal = (props) => {
  return <Placeholder getMesh={getBoxMesh} {...props} />;
};
export const Plane = (props) => {
  return <Placeholder getMesh={getPlaneMesh} {...props} />;
};
