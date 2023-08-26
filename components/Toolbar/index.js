import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  gap: 5px;
  padding: 5px;
  align-items: center;
  position: relative;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;
const Toolbar = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Toolbar;
