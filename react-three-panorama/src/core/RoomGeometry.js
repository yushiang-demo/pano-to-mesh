import * as THREE from "three";

const floorGeometry = (floorY) => {
  const geometry = new THREE.PlaneGeometry(100, 100);
  geometry.applyMatrix4(
    new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(-1, 0, 0),
      Math.PI / 2,
    ),
  );
  geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, floorY, 0));
  return geometry;
};

const create = (points, ceilingY, floorY) => {
  if (points.length < 2) return floorGeometry(floorY);

  const shape = new THREE.Shape(points);
  const geometry2D = new THREE.ShapeGeometry(shape);

  const indexRaw = geometry2D.index.array;
  const reversIndexRaw = [...indexRaw].reverse();
  const pointsRaw = geometry2D.attributes.position.array;

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
  const floorIndex = reversIndexRaw.map(
    (value) => value + numberOfCeilingPoint,
  );

  const wallTopTriangleIndex = [];
  const wallDownTriangleIndex = [];
  for (let i = 0; i < numberOfCeilingPoint; i++) {
    const nextIndex = (i + 1) % numberOfCeilingPoint;
    wallTopTriangleIndex.push(i);
    wallTopTriangleIndex.push(nextIndex);
    wallTopTriangleIndex.push(i + numberOfCeilingPoint);

    wallDownTriangleIndex.push(i + numberOfCeilingPoint);
    wallDownTriangleIndex.push(nextIndex);
    wallDownTriangleIndex.push(nextIndex + numberOfCeilingPoint);
  }

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([...ceilingPoints, ...floorPoints]);
  const index = new Uint16Array([
    ...indexRaw,
    ...floorIndex,
    ...wallTopTriangleIndex,
    ...wallDownTriangleIndex,
  ]);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(index, 1));

  return geometry;
};

export default { create, floorGeometry };
