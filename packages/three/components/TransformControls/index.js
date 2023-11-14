import { useEffect, useState } from "react";
import * as THREE from "three";
import { TransformControls as Controls } from "three/addons/controls/TransformControls.js";

export const TRANSFORM_CONTROLS_MODE = {
  TRANSLATE: "translate",
  ROTATE: "rotate",
  SCALE: "scale",
};

const TransformControls = (() => {
  const object = new THREE.Mesh();

  const initControls = ({ three, setTransformControls }) => {
    const { scene, cameraControls } = three;

    const control = new Controls(
      cameraControls.getCamera(),
      cameraControls.domElement
    );
    setTransformControls(control);
    control.setSpace("local");
    object.frustumCulled = false;
    scene.add(object);

    control.attach(object);
    scene.add(control);

    return () => {
      scene.remove(object);
      scene.remove(control);
      control.dispose();
    };
  };

  const bindChangedEvents = ({
    three,
    transformControls,
    onChange,
    onDraggingChanged,
  }) => {
    if (!transformControls) return;

    const { cameraControls } = three;
    const { onBeforeRender } = object;
    const draggingChanged = (event) => {
      const dragging = event.value;
      onDraggingChanged(dragging);
      cameraControls.setEnable(!dragging);
      object.onBeforeRender = dragging
        ? () => {
            onChange({
              position: object.position.toArray(),
              scale: object.scale.toArray(),
              quaternion: object.quaternion.toArray(),
            });
          }
        : onBeforeRender;
    };
    transformControls.addEventListener("dragging-changed", draggingChanged);

    return () => {
      transformControls.removeEventListener(
        "dragging-changed",
        draggingChanged
      );
    };
  };

  const changeControlsMode = ({ mode, transformControls }) => {
    if (!transformControls) return;
    transformControls.setMode(mode);
  };

  const setControlsTransform = ({ position, scale, quaternion }) => {
    if (position) object.position.fromArray(position);
    if (quaternion) object.quaternion.fromArray(quaternion);
    if (scale) object.scale.fromArray(scale);
  };

  return ({
    three,
    position,
    scale,
    quaternion,
    onChange,
    onDraggingChanged,
    mode = TRANSFORM_CONTROLS_MODE.TRANSLATE,
  }) => {
    const [transformControls, setTransformControls] = useState(null);

    useEffect(() => {
      return initControls({ three, setTransformControls });
    }, [three]);

    useEffect(() => {
      return bindChangedEvents({
        three,
        transformControls,
        onChange,
        onDraggingChanged,
      });
    }, [three, transformControls, onChange, onDraggingChanged]);

    useEffect(() => {
      changeControlsMode({ mode, transformControls });
    }, [mode, transformControls]);

    useEffect(() => {
      setControlsTransform({ position, scale, quaternion });
    }, [position, scale, quaternion]);

    return null;
  };
})();

export default TransformControls;
