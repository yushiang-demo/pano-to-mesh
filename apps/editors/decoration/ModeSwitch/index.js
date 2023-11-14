import { useEffect } from "react";
import Toolbar from "../../../../components/Toolbar";
import Icons from "../../../../components/Icon";

import { MODE } from "../constant";
import { TRANSFORM_CONTROLS_MODE } from "@pano-to-mesh/three";

const ModeSwitch = ({ mode, setMode, data }) => {
  useEffect(() => {
    if (!mode) setMode(MODE.SELECT);
  }, [mode, setMode]);

  const changeMode = (mode) => () => setMode(mode);
  return (
    <Toolbar>
      {data.map(({ Component, targetMode }) => (
        <Component
          key={targetMode}
          $highlight={mode === targetMode}
          onClick={changeMode(targetMode)}
        />
      ))}
    </Toolbar>
  );
};

export const EditorModeSwitch = (props) => {
  const data = [
    {
      Component: Icons.cursor,
      targetMode: MODE.SELECT,
    },
    {
      Component: Icons.placeholder,
      targetMode: MODE.ADD_2D,
    },
    {
      Component: Icons.box,
      targetMode: MODE.ADD_3D,
    },
  ];
  return <ModeSwitch {...props} data={data} />;
};
export const TransformModeSwitch = (props) => {
  const data = [
    {
      Component: Icons.axis,
      targetMode: TRANSFORM_CONTROLS_MODE.TRANSLATE,
    },
    {
      Component: Icons.scale,
      targetMode: TRANSFORM_CONTROLS_MODE.SCALE,
    },
    {
      Component: Icons.rotate,
      targetMode: TRANSFORM_CONTROLS_MODE.ROTATE,
    },
  ];
  return <ModeSwitch {...props} data={data} />;
};
