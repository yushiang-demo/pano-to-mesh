import  { useEffect, useState } from "react";

import {
  Core
} from "../three";

const pointSelector = (x, y, unitParser, threshold) => {
    return ([candidateX, candidateY]) => {
      const normalizedVector = {
        x: candidateX - x,
        y: candidateY - y,
      };
      const pixelVector = unitParser(normalizedVector);
      const distance = Math.sqrt((pixelVector.x ** 2 + pixelVector.y ** 2) ^ 2);
      return threshold > distance;
    };
  };

const useClick2AddWalls = ({
    panoramaOrigin,
    floorY,
    selectThresholdPixel,
  }) => {
    const [dragging, setDragging] = useState(false);
    const [previewWall2D, setPreviewWall2D] = useState(null);
    const [wall2DCoord, setWall2DCoord] = useState([]);
    const [wall3DCoord, setWall3DCoord] = useState([]);
  
    const parseMousePointTo3D = ([normalizedX, normalizedY]) => {
      const { longitude, latitude } =
        Core.Math.coordinates.normalizedXY2Spherical(normalizedX, normalizedY);
      const { x, y, z } = Core.Math.coordinates.spherical2CartesianDirection(
        longitude,
        latitude
      );
      const point = Core.findIntersectionOfXZPlane(
        panoramaOrigin,
        [x, y, z],
        floorY
      );
      return point;
    };
  
    useEffect(() => {
      if (dragging) document.body.style.cursor = "crosshair";
      else document.body.style.cursor = "default";
    }, [dragging]);
  
    const onMouseLeave = () => {
      setPreviewWall2D(null);
      setDragging(false);
    };
    const onMouseMove = ({ normalizedX, normalizedY, width, height }) => {
      if (dragging && parseMousePointTo3D([normalizedX, normalizedY]))
        setPreviewWall2D([normalizedX, normalizedY]);
      else {
        const point = wall2DCoord.find(
          pointSelector(
            normalizedX,
            normalizedY,
            ({ x, y }) => ({
              x: x * width,
              y: y * height,
            }),
            selectThresholdPixel
          )
        );
        if (point) document.body.style.cursor = "crosshair";
        else document.body.style.cursor = "default";
      }
    };
  
    const onMouseUp = ({ normalizedX, normalizedY }) => {
      if (dragging) {
        if (parseMousePointTo3D([normalizedX, normalizedY]))
          setWall2DCoord([...wall2DCoord, [normalizedX, normalizedY]]);
        setDragging(false);
      }
    };
  
    const onMouseDown = ({ width, height, normalizedX, normalizedY }) => {
      const points = wall2DCoord.filter(
        ([x, y]) =>
          !pointSelector(
            normalizedX,
            normalizedY,
            ({ x, y }) => ({
              x: x * width,
              y: y * height,
            }),
            selectThresholdPixel
          )([x, y])
      );
      if (points.length) setWall2DCoord(points);
      setDragging(true);
      setPreviewWall2D([normalizedX, normalizedY]);
    };
  
    useEffect(() => {
      const coord2d = [...wall2DCoord];
      if (previewWall2D) coord2d.push(previewWall2D);
      coord2d.sort(([x1], [x2]) => x1 - x2);
  
      const points3D = coord2d
        .map((coord) => {
          const point = parseMousePointTo3D(coord, panoramaOrigin, floorY);
          if (point) return point;
        })
        .filter((value) => value);
      setWall3DCoord(points3D);
    }, [wall2DCoord, previewWall2D]);
  
    return {
      wall3DCoord,
      eventHandlers: {
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onMouseLeave,
      },
    };
  };
  
  export default useClick2AddWalls;