import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const MODE = {
  FIRST_PERSON_VIEW: "FIRST_PERSON_VIEW",
  TOP_VIEW: "TOP_VIEW",
};

const FOCUS_VIEW_SCALE = 0.8;

const lerp = (start, end, progress) => {
  return start * (1 - progress) + end * progress;
};

function CameraControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);

  const setEnable = (data) => {
    controls.enabled = data;
  };

  let viewport = MODE.TOP_VIEW;
  const setMode = (mode, object) => {
    viewport = mode;
    if (mode === MODE.FIRST_PERSON_VIEW) {
      const viewDirection = new THREE.Vector3()
        .subVectors(controls.target, camera.position)
        .setLength(1e-6);
      controls.target.addVectors(camera.position, viewDirection);
      controls.maxDistance = 1e-6;
      controls.minDistance = 1e-6;
      controls.maxPolarAngle = Math.PI;
      controls.minPolarAngle = 0;
      controls.update();
    }

    if (mode === MODE.TOP_VIEW && object) {
      const { distance: minDistance } = getFocusSettings(object, 1.0);
      const { distance: maxDistance } = getFocusSettings(object, 0.5);
      controls.maxDistance = maxDistance;
      controls.minDistance = minDistance;
      controls.maxPolarAngle = Math.PI / 2;
      controls.minPolarAngle = 0;
      controls.maxAzimuthAngle = Infinity;
      controls.minAzimuthAngle = -Infinity;
      controls.update();
    }
  };

  const setPosition = (target) => {
    const viewDirection = new THREE.Vector3().subVectors(
      controls.target,
      camera.position
    );
    camera.position.copy(target);
    controls.target.addVectors(camera.position, viewDirection);
    controls.update();
  };

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

  let constraintPanEvent = null;
  const focus = (
    object,
    constraintZoom = true,
    constraintPan = true,
    constraintRotate = true
  ) => {
    if (!object) return;
    const { origin, distance, boundingBox } = getFocusSettings(
      object,
      FOCUS_VIEW_SCALE
    );
    lookAt(...origin.toArray());

    controls.maxDistance = distance;
    controls.minDistance = distance;
    controls.update();
    controls.maxDistance = Infinity;
    controls.minDistance = 0;
    controls.update();

    if (constraintZoom) {
      const { distance: minDistance } = getFocusSettings(object, 1.0);
      const { distance: maxDistance } = getFocusSettings(object, 0.5);
      controls.maxDistance = maxDistance;
      controls.minDistance = minDistance;
      controls.update();
    }

    if (constraintRotate) {
      controls.maxPolarAngle = Math.PI / 2;
      controls.minPolarAngle = 0;
      controls.maxAzimuthAngle = Infinity;
      controls.minAzimuthAngle = -Infinity;
      controls.update();
    }

    if (constraintPan) {
      const checkTarget = () => {
        if (viewport !== MODE.TOP_VIEW) return;
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
      constraintPanEvent = () => controls.removeEventListener("change");
    }
  };

  const destroy = () => {
    if (constraintPanEvent) {
      constraintPanEvent();
    }
  };

  const moveToTop = (object) => {
    const { distance } = getFocusSettings(object, FOCUS_VIEW_SCALE);

    const startDistance = controls.getDistance();
    const endDistance = distance;

    const distanceClip = {
      update: (progress) => {
        const targetDistance = lerp(startDistance, endDistance, progress);
        controls.maxDistance = targetDistance;
        controls.minDistance = targetDistance;
        controls.update();
      },
    };

    const startPolarAngle = controls.getPolarAngle();
    const endPolarAngle = Math.min(startPolarAngle, Math.PI / 4);

    const polarAngleClip = {
      update: (progress) => {
        const targetPolarAngle = lerp(startPolarAngle, endPolarAngle, progress);
        controls.maxPolarAngle = targetPolarAngle;
        controls.minPolarAngle = targetPolarAngle;
        controls.update();
      },
      duration: 500,
      timeOffset: 0,
    };

    const completeClip = {
      update: () => {},
      complete: () => {
        controls.maxDistance = endDistance;
        controls.minDistance = endDistance;
        controls.maxPolarAngle = endPolarAngle;
        controls.minPolarAngle = endPolarAngle;
        controls.update();
        setMode(MODE.TOP_VIEW, object);
      },
    };

    const clips = [distanceClip, polarAngleClip, completeClip];

    return clips;
  };

  const moveTo = (target) => {
    const start = camera.position;
    const end = new THREE.Vector3().fromArray(target);
    const update = (progress) => {
      const position = new THREE.Vector3().lerpVectors(start, end, progress);
      setPosition(position);
    };
    const complete = () => setPosition(end);

    const clips = [{ update, complete }];

    return clips;
  };

  const moveFromTop = (target) => {
    const start = camera.position;
    const end = new THREE.Vector3().fromArray(target);
    const update = (progress) => {
      const position = new THREE.Vector3().lerpVectors(start, end, progress);
      setPosition(position);
    };
    const begin = () => setMode(MODE.FIRST_PERSON_VIEW);
    const complete = () => setPosition(end);

    const clips = [{ begin, update, complete }];
    return clips;
  };

  return {
    domElement,
    getCamera: () => controls.object,
    setEnable,
    lookAt,
    focus,
    destroy,
    animations: {
      moveFromTop,
      moveTo,
      moveToTop,
    },
  };
}

export default CameraControls;
