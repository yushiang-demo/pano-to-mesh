import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { RENDER_ORDER } from "../../constant";

const Css3DObject = ({
  three,
  children,
  resolution,
  position,
  scale,
  quaternion,
}) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3().fromArray(position),
      new THREE.Quaternion().fromArray(quaternion),
      new THREE.Vector3().fromArray(scale)
    );

    const { css3DControls, scene } = three;
    const { object3D, remove, element } =
      css3DControls.create3DElement(resolution);
    setContainer(element);

    object3D.applyMatrix4(matrix);

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.renderOrder = RENDER_ORDER.CSS3D;
    plane.applyMatrix4(matrix);

    scene.add(plane);

    return () => {
      scene.remove(plane);
      geometry.dispose();
      remove();
    };
  }, [three, resolution, position, scale, quaternion]);

  return <>{container && createPortal(children, container)}</>;
};

export default Css3DObject;
