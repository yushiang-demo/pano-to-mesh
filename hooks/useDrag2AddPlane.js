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

  const onMouseMove = ({ normalizedX, normalizedY }) => {
    if (!isDragging) return;
    const { point, faceNormal: normal } = get3DPoint([
      normalizedX,
      normalizedY,
    ]);
    if (JSON.stringify(normal) !== JSON.stringify(faceNormal)) return;
    if (point) {
      setEndPoint(point);
    }
  };
  const onMouseUp = ({ normalizedX, normalizedY }) => {
    setIsDragging(false);
    const { point } = get3DPoint([normalizedX, normalizedY]);

    if (onEnd) {
      onEnd(startPoint, point);
    }
    setStartPoint(null);
    setEndPoint(null);
  };
  const onMouseDown = ({ normalizedX, normalizedY }) => {
    setIsDragging(true);
    const { point, faceNormal } = get3DPoint([normalizedX, normalizedY]);
    if (isDragging) {
      setEndPoint(point);
      setIsDragging(false);
      return;
    }

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
