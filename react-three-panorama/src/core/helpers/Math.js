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

export default {
  coordinates: { spherical2CartesianDirection, normalizedXY2Spherical },
};
