import * as THREE from "three";

const normalizedXY2Spherical = (normalizedX, normalizedY) => {
  const longitude = normalizedX * 2 * Math.PI - Math.PI;
  const latitude = normalizedY * Math.PI;
  return { longitude, latitude };
};

const spherical2CartesianDirection = (longitude, latitude) => {
  return {
    x: -Math.sin(longitude) * Math.sin(latitude),
    y: Math.cos(latitude),
    z: -Math.cos(longitude) * Math.sin(latitude),
  };
};

const cartesian2Spherical = (x0, y0, z0) => {
  const normalizeVector = (vector) => {
    const magnitude = Math.sqrt(
      vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2
    );
    return [
      vector[0] / magnitude,
      vector[1] / magnitude,
      vector[2] / magnitude,
    ];
  };

  const [x, y, z] = normalizeVector([x0, y0, z0]);
  const longitude = Math.atan2(-x, -z);
  const latitude = Math.acos(y);

  return {
    longitude,
    latitude,
  };
};

const spherical2NormalizedXY = (longitude, latitude) => {
  const normalizedX = (longitude + Math.PI) / (2 * Math.PI);
  const normalizedY = latitude / Math.PI;
  return { x: normalizedX, y: normalizedY };
};

const matrixFromPointsAndNormal = (pointA, pointB, normal) => {
  if (!pointA || !pointB || !normal) return null;

  const pointStart = new THREE.Vector3().fromArray(pointA);
  const pointEnd = new THREE.Vector3().fromArray(pointB);

  const center = new THREE.Vector3()
    .addVectors(pointStart, pointEnd)
    .multiplyScalar(0.5);

  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3().fromArray(normal)
  );

  const getSize = (pointStart, pointEnd, quaternion) => {
    const calcSize = (pointStart, pointEnd, quaternion) => {
      const direction = new THREE.Vector3().subVectors(pointStart, pointEnd);
      const size = direction
        .clone()
        .applyQuaternion(quaternion.clone().invert());

      return new THREE.Vector3(
        Math.abs(size.x),
        Math.abs(size.y),
        Math.abs(size.z)
      );
    };

    const size = calcSize(pointStart, pointEnd, quaternion);
    return size;
  };

  const size = getSize(pointStart, pointEnd, quaternion);

  return {
    position: center.toArray(),
    scale: [size.x, size.y, Math.max(size.x, size.y)],
    quaternion: quaternion.toArray(),
  };
};

const math = {
  coordinates: {
    spherical2CartesianDirection,
    normalizedXY2Spherical,
    cartesian2Spherical,
    spherical2NormalizedXY,
  },
  transformation: {
    matrixFromPointsAndNormal,
  },
};

export default math;
