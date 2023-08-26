import { Rnd } from "react-rnd";

const ToolbarRnd = ({ children }) => {
  return (
    <Rnd
      enableResizing={{
        top: false,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      {children}
    </Rnd>
  );
};

export default ToolbarRnd;
