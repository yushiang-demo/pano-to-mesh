import { useEffect } from "react";
import { RENDER_ORDER } from "../../constant";
import { getBoxMesh } from "../../helpers/MediaLoader";

const Placeholder = ({ three, position, scale, quaternion }) => {
  useEffect(() => {
    const { scene } = three;

    const mesh = getBoxMesh();
    mesh.setTransform({ position, scale, quaternion });
    mesh.object.renderOrder = RENDER_ORDER.MESH;
    scene.add(mesh.object);

    return () => {
      scene.remove(mesh.object);
      mesh.dispose();
    };
  }, [three, position, scale, quaternion]);

  return null;
};

export default Placeholder;
