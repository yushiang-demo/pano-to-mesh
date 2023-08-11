import React, { forwardRef, useEffect, useRef, useState } from "react";

import InitThree from "../../core";

const monitorStyle = {
  position: "absolute",
  zIndex: "1",
  background: "gray",
  color: "white",
  padding: "5px",
  margin: "5px",
  bottom: "0",
};

const WrapperStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
};

const CanvasStyle = {
  position: "absolute",
};

const ThreeCanvas = (
  { children, onMouseDown, onMouseMove, onMouseUp, dev, ...props },
  ref
) => {
  const [three, setThree] = useState(null);
  const [monitor, setMonitor] = useState("");
  const WrapperRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const {
      destroy,
      setCanvasSize,
      scene,
      addBeforeRenderFunction,
      renderer,
      cameraControls,
    } = InitThree({
      canvas: canvasRef.current,
    });

    setThree({ scene, addBeforeRenderFunction, renderer, cameraControls });

    const cancelResizeListener = addBeforeRenderFunction(() => {
      const { clientWidth: width, clientHeight: height } = WrapperRef.current;
      setCanvasSize(width, height);
    });

    const stopMonitorMemory = dev
      ? addBeforeRenderFunction((renderer) => {
          const displayObject = renderer.info.memory;
          const jsonText = JSON.stringify(displayObject, null, 4);

          const formatJsonString = (jsonText) => {
            const lines = jsonText.split("\n");
            lines.shift();
            lines.pop();
            const result = lines.map((line) => line.trim()).join("\n");
            return result;
          };

          const result = formatJsonString(jsonText);
          setMonitor(result);
        })
      : () => null;

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
      stopMonitorMemory();
      destroy();
    };
  }, [dev, ref]);

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
      {dev && <pre style={monitorStyle}>{monitor}</pre>}
      <canvas
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
