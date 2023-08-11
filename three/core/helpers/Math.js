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

const Math = {
  coordinates: {
    spherical2CartesianDirection,
    normalizedXY2Spherical,
    cartesian2Spherical,
    spherical2NormalizedXY,
  },
};

export default Math;
