import styled from "styled-components";

export const CssImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.src});
  background-size: 100% 100%;
`;
