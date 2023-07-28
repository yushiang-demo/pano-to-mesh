import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  gap: 5px;
  padding: 5px;
  align-items: center;
  position: relative;
`;
const Toolbar = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Toolbar;
