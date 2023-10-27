import React, { forwardRef, useEffect, useRef, useState } from "react";

import { Css3D, Three } from "../../core";

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
  pointerEvents: "none",
};

const Css3DContainerStyle = {
  position: "absolute",
  pointerEvents: "none",
};

const ThreeCanvas = (
  { children, onMouseDown, onMouseMove, onMouseUp, dev, ...props },
  ref
) => {
  const [three, setThree] = useState(null);
  const [monitor, setMonitor] = useState("");
  const WrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const css3DWrapperRef = useRef(null);
  useEffect(() => {
    const {
      destroy,
      setCanvasSize,
      scene,
      addBeforeRenderEvent,
      renderer,
      cameraControls,
    } = new Three({
      interactElement: WrapperRef.current,
      canvas: canvasRef.current,
    });

    const css3DControls = new Css3D({
      container: css3DWrapperRef.current,
      camera: cameraControls.getCamera(),
    });

    const stopRenderCss3D = addBeforeRenderEvent(() => {
      css3DControls.render();
    });

    const publicProps = {
      scene,
      addBeforeRenderEvent,
      renderer,
      cameraControls,
      css3DControls,
    };

    setThree(publicProps);

    const cancelResizeListener = addBeforeRenderEvent(() => {
      const { clientWidth: width, clientHeight: height } = WrapperRef.current;
      setCanvasSize(width, height);
      css3DControls.setSize(width, height);
    });

    const stopMonitorMemory = dev
      ? addBeforeRenderEvent((renderer) => {
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
        ...publicProps,
      };
    }

    return () => {
      cancelResizeListener();
      stopMonitorMemory();
      destroy();
      stopRenderCss3D();
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
      if (e.target !== WrapperRef.current) return;
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
    <div
      ref={WrapperRef}
      style={WrapperStyle}
      onPointerDown={handleMouseEvents(onMouseDown)}
      onPointerMove={handleMouseEvents(onMouseMove)}
      onPointerUp={handleMouseEvents(onMouseUp)}
    >
      {dev && <pre style={monitorStyle}>{monitor}</pre>}
      <div ref={css3DWrapperRef} style={Css3DContainerStyle} />
      <canvas ref={canvasRef} {...props} style={CanvasStyle} />
      {three && childrenWithProps}
    </div>
  );
};

export default forwardRef(ThreeCanvas);
