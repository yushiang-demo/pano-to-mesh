import React, { forwardRef, useEffect, useRef, useState } from "react";

import InitThree from "../../core";

const WrapperStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
};

const CanvasStyle = {
  position: "absolute",
};

const ThreeCanvas = (
  {
    children,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    aspectRatio = 9 / 16,
    ...props
  },
  ref
) => {
  const [three, setThree] = useState(null);
  const WrapperRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const { destroy, setCanvasSize, scene, addBeforeRenderFunction } =
      InitThree({
        canvas: canvasRef.current,
      });

    setThree({ scene, addBeforeRenderFunction });

    const cancelResizeListener = addBeforeRenderFunction(() => {
      const { clientWidth: width, clientHeight: height } = WrapperRef.current;
      setCanvasSize(width, height);
    });

    if (ref) {
      ref.current = {
        getTexture: () => {
          const dataURL = canvasRef.current.toDataURL();
          return dataURL;
        },
      };
    }

    return () => {
      cancelResizeListener();
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
    <div ref={WrapperRef} style={WrapperStyle}>
      <canvas
        tabIndex={1}
        ref={canvasRef}
        onMouseDown={handleMouseEvents(onMouseDown)}
        onMouseMove={handleMouseEvents(onMouseMove)}
        onMouseUp={handleMouseEvents(onMouseUp)}
        {...props}
        style={CanvasStyle}
      />
      {three && childrenWithProps}
    </div>
  );
};

export default forwardRef(ThreeCanvas);
