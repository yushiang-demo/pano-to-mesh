import * as THREE from "three";

const floorGeometry = (floorY) => {
  const geometry = new THREE.PlaneGeometry(100, 100);
  geometry.applyMatrix4(
    new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(-1, 0, 0),
      Math.PI / 2
    )
  );
  geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, floorY, 0));
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

const create = (points, ceilingY, floorY) => {
  if (points.length < 2) return floorGeometry(floorY);

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
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3)
  );
  geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indexes), 1));

  return geometry;
};

export default { create, floorGeometry };
