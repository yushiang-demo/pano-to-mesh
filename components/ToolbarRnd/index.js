import { styled } from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  background: #e2e2e2;
  border-radius: 5px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const ToolbarRnd = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default ToolbarRnd;
