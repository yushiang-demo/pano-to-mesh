import styled from "styled-components";

export const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  background: white;
  pointer-events: none;
`;

export const PointerEvents = styled.div`
  width: 100%;
  height: 100%;
  &:focus-within {
    ${Iframe} {
      pointer-events: auto;
    }
  }
`;
