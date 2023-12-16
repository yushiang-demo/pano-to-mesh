import { useState } from "react";

const MOUSE_UP_THRESHOLD = 5;

const useMouseSkipDrag = (handleMouseUp) => {
  const [cursorPosition, setCursorPosition] = useState(null);
  const [cumulativeDelta, setCumulativeDelta] = useState(0);

  const onMouseDown = ({ offsetX, offsetY }) => {
    setCursorPosition({ offsetX, offsetY });
    setCumulativeDelta(0);
  };
  const onMouseMove = ({ offsetX, offsetY }) => {
    if (!cursorPosition) return;
    setCumulativeDelta(
      (prev) =>
        prev +
        Math.abs(offsetX - cursorPosition.offsetX) +
        Math.abs(offsetY - cursorPosition.offsetY)
    );
    setCursorPosition({ offsetX, offsetY });
  };
  const onMouseUp = (data) => {
    setCursorPosition(null);
    if (MOUSE_UP_THRESHOLD < cumulativeDelta) return;
    handleMouseUp(data);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
};

export default useMouseSkipDrag;
