import { useState } from "react";

import { Core } from "../three";

const useDrag2AddPlane = ({ camera, raycasterTarget, onEnd }) => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [faceNormal, setFaceNormal] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const get3DPoint = (pointer) => {
    const intersections = Core.raycastMeshFromScreen(
      pointer,
      camera,
      raycasterTarget
    );
    const firstIntersection = intersections[0];

    if (firstIntersection) {
      const { faceNormal, point } = firstIntersection;
      const offset = 1e-2;
      return {
        faceNormal,
        point: [
          point[0] + faceNormal[0] * offset,
          point[1] + faceNormal[1] * offset,
          point[2] + faceNormal[2] * offset,
        ],
      };
    }
  };

  const normalIsTheSame = (normal) => {
    const distance = Math.sqrt(
      (normal[0] - faceNormal[0]) ** 2 +
        (normal[1] - faceNormal[1]) ** 2 +
        (normal[2] - faceNormal[2]) ** 2
    );
    return distance < 1e-1;
  };

  const onMouseMove = ({ normalizedX, normalizedY }) => {
    if (!isDragging) return;
    const intersect = get3DPoint([normalizedX, normalizedY]);
    if (!intersect) return;
    const { point, faceNormal } = intersect;

    if (!normalIsTheSame(faceNormal)) return;
    if (point) {
      setEndPoint(point);
    }
  };
  const onMouseUp = ({ normalizedX, normalizedY }) => {
    const intersect = get3DPoint([normalizedX, normalizedY]);
    if (!intersect) return;
    const { point, faceNormal } = intersect;
    if (!normalIsTheSame(faceNormal)) return;
    setIsDragging(false);

    if (onEnd) {
      onEnd(startPoint, point, faceNormal);
    }
    setStartPoint(null);
    setEndPoint(null);
  };
  const onMouseDown = ({ normalizedX, normalizedY }) => {
    if (isDragging) return;

    setIsDragging(true);
    const intersect = get3DPoint([normalizedX, normalizedY]);
    if (!intersect) return;
    const { point, faceNormal } = intersect;

    if (point) {
      setStartPoint(point);
    }

    if (faceNormal) {
      setFaceNormal(faceNormal);
    }
  };

  return {
    startPoint,
    endPoint,
    faceNormal,
    eventHandlers: {
      onMouseDown,
      onMouseUp,
      onMouseMove,
    },
  };
};

export default useDrag2AddPlane;
