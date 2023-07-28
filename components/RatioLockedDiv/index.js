import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  width: calc(100% * 0.7);
  padding-top: calc(56.25% * 0.7);
  border-radius: 10px;
  border: 1px solid black;
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const RatioLockedDiv = ({ children }) => {
  return (
    <Wrapper>
      <Container>{children}</Container>
    </Wrapper>
  );
};

export default RatioLockedDiv;
