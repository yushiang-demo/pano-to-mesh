import { Rnd } from "react-rnd";
import { styled } from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #e2e2e2;
  border-radius: 5px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const ToolbarRnd = ({ children }) => {
  return (
    <Rnd
      default={{
        x: 10,
        y: 10,
      }}
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
      <Wrapper>{children}</Wrapper>
    </Rnd>
  );
};

export default ToolbarRnd;
