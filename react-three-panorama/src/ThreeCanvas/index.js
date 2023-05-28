import React, { useEffect, useRef, useState } from "react";

import InitThree from "../core";

const ThreeCanvas = ({
  children,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  aspectRatio = 9 / 16,
  ...props
}) => {
  const [three, setThree] = useState(null);
  const WrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const { destroy, setCanvasSize, scene, addRenderFunction } = InitThree({
      canvas: canvasRef.current,
    });

    const onWindowResize = () => {
      const { clientWidth: width } = WrapperRef.current;
      setCanvasSize(width, width * aspectRatio);
    };
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    setThree({ scene, addRenderFunction });

    return () => {
      window.removeEventListener("resize", onWindowResize, false);
      destroy();
    };
  }, []);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { three });
    }
    return child;
  });

  const handleMouseEvents = (callback) => {
    return (e) => {
      const { offsetX, offsetY } = e.nativeEvent;
      const { width, height } = canvasRef.current;
      if (callback)
        callback({
          event: e,
          offsetX,
          offsetY,
          width,
          height,
          normalizedX: offsetX / width,
          normalizedY: offsetY / height,
        });
    };
  };

  return (
    <div ref={WrapperRef}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseEvents(onMouseDown)}
        onMouseMove={handleMouseEvents(onMouseMove)}
        onMouseUp={handleMouseEvents(onMouseUp)}
        {...props}
      />
      {three && childrenWithProps}
    </div>
  );
};

export default ThreeCanvas;
