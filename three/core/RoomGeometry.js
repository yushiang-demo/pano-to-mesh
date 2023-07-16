import * as THREE from "three";

export const getEmptyRoomGeometry = ({ floorY, ceilingY }) => {
  const geometry = new THREE.BufferGeometry();
  const planeSize = 1e5;
  const vertices = new Float32Array(
    [
      [-planeSize, floorY, planeSize],
      [-planeSize, floorY, -planeSize],
      [planeSize, floorY, -planeSize],
      [planeSize, floorY, planeSize],
      [-planeSize, ceilingY, planeSize],
      [-planeSize, ceilingY, -planeSize],
      [planeSize, ceilingY, -planeSize],
      [planeSize, ceilingY, planeSize],
    ].flatMap((data) => data)
  );
  const uvs = new Float32Array(
    [
      [0, 1],
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
      [1, 0],
      [1, 1],
    ].flatMap((data) => data)
  );
  const indices = new Uint16Array(
    [
      [0, 2, 1],
      [0, 3, 2],
      [4, 5, 6],
      [4, 6, 7],
    ].flatMap((data) => data)
  );

  geometry.setAttribute(
    "textureUV",
    new THREE.BufferAttribute(new Float32Array(uvs), 2)
  );
  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(vertices.map(() => 0)), 3)
  );
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  return geometry;
};

const flattenTriangleVertices = (vertices, indexes) => {
  const flattenVertices = indexes.flatMap((index) => {
    const pointIndexBegin = index * 3;
    return [
      vertices[pointIndexBegin],
      vertices[pointIndexBegin + 1],
      vertices[pointIndexBegin + 2],
    ];
  });

  return flattenVertices;
};

const points3DToUvs = (verticesXYZ, baseScale, baseOffsetX, baseOffsetZ) => {
  const xCoords = verticesXYZ.filter((_, index) => index % 3 === 0);
  const zCoords = verticesXYZ.filter((_, index) => index % 3 === 2);
  const getScale = (coords) => 1 / (Math.max(...coords) - Math.min(...coords));
  const scale = Math.min(getScale(xCoords), getScale(zCoords));
  const offsetX = Math.min(...xCoords);
  const offsetZ = Math.min(...zCoords);

  return (data, idx) => {
    if (idx % 2 == 0) {
      return (data - offsetX) * scale * baseScale + baseOffsetX;
    } else {
      return (data - offsetZ) * scale * baseScale + baseOffsetZ;
    }
  };
};

const pointsIndexToWallUvs = (steps) => {
  return (_, index) => {
    const toWallIndex = (index) => Math.trunc(index / 12);
    const getUv1X = (index) => steps[toWallIndex(index)];
    const getUv2X = (index) => steps[toWallIndex(index) + 1];
    const getUvFloorY = () => 0;
    const getUv2CeilingY = () => 0.5;
    // Order : [ceiling1, ceiling2, floor1, floor1, ceiling2, floor2];
    const parser = [
      [getUv1X, getUv2CeilingY],
      [getUv2X, getUv2CeilingY],
      [getUv1X, getUvFloorY],
      [getUv1X, getUvFloorY],
      [getUv2X, getUv2CeilingY],
      [getUv2X, getUvFloorY],
    ].flatMap((data) => data);
    return parser[index % 12](index);
  };
};

const create = (points, ceilingY, floorY) => {
  if (points.length < 2) return getEmptyRoomGeometry({ ceilingY, floorY });

  const shape = new THREE.Shape(points);
  const geometry2D = new THREE.ShapeGeometry(shape);

  const indexesRaw = [...geometry2D.index.array];
  const pointsRaw = geometry2D.attributes.position.array;

  const floorIndexes = [...indexesRaw]
    .reverse()
    .map((value) => value + pointsRaw.length / 3);

  const ceilingPoints = [...pointsRaw];
  const numberOfCeilingPoint = ceilingPoints.length / 3;
  for (let i = 0; i < ceilingPoints.length; i += 3) {
    ceilingPoints[i + 2] = ceilingPoints[i + 1];
    ceilingPoints[i + 1] = ceilingY;
  }

  const floorPoints = [...pointsRaw];
  for (let i = 0; i < floorPoints.length; i += 3) {
    floorPoints[i + 2] = floorPoints[i + 1];
    floorPoints[i + 1] = floorY;
  }

  const wallIndexes = [];
  for (let i = 0; i < numberOfCeilingPoint; i++) {
    const nextIndex = (i + 1) % numberOfCeilingPoint;
    wallIndexes.push(i);
    wallIndexes.push(nextIndex);
    wallIndexes.push(i + numberOfCeilingPoint);

    wallIndexes.push(i + numberOfCeilingPoint);
    wallIndexes.push(nextIndex);
    wallIndexes.push(nextIndex + numberOfCeilingPoint);
  }

  const verticesOrigin = [...ceilingPoints, ...floorPoints];

  const ceilingVertices = flattenTriangleVertices(verticesOrigin, indexesRaw);
  const floorVertices = flattenTriangleVertices(verticesOrigin, floorIndexes);
  const wallVertices = flattenTriangleVertices(verticesOrigin, wallIndexes);
  const wallCount = wallVertices.length / 18;

  const vertices = [...ceilingVertices, ...floorVertices, ...wallVertices];
  const colors = [
    ...ceilingVertices.map(() => 0),
    ...floorVertices.map(() => 1),
    ...wallVertices.map((_, index) => {
      const toWallIndex = (index) => Math.trunc(index / 18);
      const indexToColorSkipBlackAndWhite = (index) =>
        index / (wallCount + 1) + 1 / wallCount;
      return indexToColorSkipBlackAndWhite(toWallIndex(index));
    }),
  ];

  const notYCoord = (_, idx) => idx % 3 !== 1;
  const normalizedCeiling = points3DToUvs(ceilingVertices, 0.5, 0.0, 0.5);
  const normalizedFloor = points3DToUvs(floorVertices, 0.5, 0.5, 0.5);
  const normalizeWall = pointsIndexToWallUvs([
    0,
    ...Array.from({ length: wallCount }, (_, i) => ((i + 1) * 1) / wallCount),
  ]);
  const uvs = [
    ...ceilingVertices.filter(notYCoord).map(normalizedCeiling),
    ...floorVertices.filter(notYCoord).map(normalizedFloor),
    ...wallVertices.filter(notYCoord).map(normalizeWall),
  ];

  const indexes = Array.from(
    { length: vertices.length / 3 },
    (_, index) => index
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
  geometry.setAttribute(
    "textureUV",
    new THREE.BufferAttribute(new Float32Array(uvs), 2)
  );
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3)
  );
  geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indexes), 1));

  return geometry;
};

export default { create };
