import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function CameraControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);

  const setTarget = (target) => {
    const delta = new THREE.Vector3().subVectors(
      camera.position,
      controls.target
    );
    controls.target.copy(target);
    camera.position.addVectors(delta, controls.target);
  };

  const lookAt = (x, y, z) => {
    controls.target.set(x, y, z);
  };

  const getFocusSettings = (object, viewScale) => {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const origin = new THREE.Vector3();
    boundingBox.getCenter(origin);

    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const maxLength = (Math.max(...size.toArray()) * 0.5) / viewScale;
    const distanceFromFloor =
      maxLength / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

    const originToCeilingDistance = size.y - origin.y;

    return {
      origin,
      distance: distanceFromFloor + originToCeilingDistance,
      boundingBox,
    };
  };

  const focus = (object, constraintZoom, constraintPan) => {
    if (!object) return;
    const { origin, distance, boundingBox } = getFocusSettings(object, 0.8);
    lookAt(...origin.toArray());

    controls.maxDistance = distance;
    controls.minDistance = distance;
    controls.update();

    if (constraintZoom) {
      const { distance: minDistance } = getFocusSettings(object, 1.0);
      const { distance: maxDistance } = getFocusSettings(object, 0.5);
      controls.maxDistance = maxDistance;
      controls.minDistance = minDistance;
      controls.update();
    }

    if (constraintPan) {
      const checkTarget = () => {
        if (
          boundingBox.min.length() === Infinity ||
          boundingBox.max.length() === Infinity
        ) {
          return;
        }

        const minPan = new THREE.Vector3(
          boundingBox.min.x,
          origin.y,
          boundingBox.min.z
        );
        const maxPan = new THREE.Vector3(
          boundingBox.max.x,
          origin.y,
          boundingBox.max.z
        );

        const newTarget = new THREE.Vector3()
          .copy(controls.target)
          .clamp(minPan, maxPan);

        setTarget(newTarget);
      };
      controls.addEventListener("change", checkTarget);
      return () => controls.removeEventListener("change");
    }
  };

  return {
    getCamera: () => controls.object,
    setEnable: (data) => {
      controls.enabled = data;
    },
    lookAt,
    setHemisphereConstraint: () => {
      controls.maxPolarAngle = Math.PI / 2;
      controls.minPolarAngle = 0;
      controls.maxAzimuthAngle = Infinity;
      controls.minAzimuthAngle = -Infinity;
      controls.update();
    },
    focus,
  };
}

export default CameraControls;
