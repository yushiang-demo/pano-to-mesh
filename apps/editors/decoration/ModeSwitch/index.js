import { useEffect } from "react";
import ToolbarRnd from "../../../../components/ToolbarRnd";
import Toolbar from "../../../../components/Toolbar";
import Icons from "../../../../components/Icon";

import { MODE } from "../constant";

const ModeSwitch = ({ mode, setMode }) => {
  useEffect(() => {
    if (!mode) setMode(MODE.VIEW);
  }, [mode, setMode]);

  const changeMode = (mode) => () => setMode(mode);
  return (
    <ToolbarRnd>
      <Toolbar>
        <Icons.cursor
          $highlight={mode === MODE.VIEW}
          onClick={changeMode(MODE.VIEW)}
        />
        <Icons.placeholder
          $highlight={mode === MODE.ADD_2D}
          onClick={changeMode(MODE.ADD_2D)}
        />
        <Icons.box
          $highlight={mode === MODE.ADD_3D}
          onClick={changeMode(MODE.ADD_3D)}
        />
        <Icons.axis
          $highlight={mode === MODE.TRANSFORM}
          onClick={changeMode(MODE.TRANSFORM)}
        />
      </Toolbar>
    </ToolbarRnd>
  );
};

export default ModeSwitch;
