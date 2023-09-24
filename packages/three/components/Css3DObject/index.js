import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { RENDER_ORDER } from "../../constant";
import { getPlaneMesh } from "../../helpers/MediaLoader";

const Css3DObject = ({
  three,
  children,
  resolution,
  position,
  scale,
  quaternion,
  readonly,
}) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3().fromArray(position),
      new THREE.Quaternion().fromArray(quaternion),
      new THREE.Vector3().fromArray(scale)
    );

    const { css3DControls, scene } = three;
    const { object3D, remove, element } = css3DControls.create3DElement(
      resolution,
      readonly
    );
    setContainer(element);

    object3D.applyMatrix4(matrix);

    const mesh = getPlaneMesh();
    mesh.object.renderOrder = RENDER_ORDER.CSS3D;
    mesh.object.applyMatrix4(matrix);

    mesh.object.onBeforeRender = (renderer, scene, camera) => {
      const cameraForward = new THREE.Vector3(0, 0, -1);
      cameraForward.applyQuaternion(mesh.object.quaternion);

      const directionToMesh = new THREE.Vector3();
      mesh.object.getWorldPosition(directionToMesh);
      directionToMesh.sub(camera.position);

      cameraForward.normalize();
      directionToMesh.normalize();

      const angle = cameraForward.dot(directionToMesh);

      element.style.opacity = angle < 0 ? 0 : 1;
    };

    scene.add(mesh.object);

    return () => {
      scene.remove(mesh.object);
      mesh.dispose();
      remove();
    };
  }, [three, resolution, position, scale, quaternion, readonly]);

  return <>{container && createPortal(children, container)}</>;
};

export default Css3DObject;