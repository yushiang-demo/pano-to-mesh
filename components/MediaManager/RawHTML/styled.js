import styled from "styled-components";

export const PointerEventControls = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  &:focus-within {
    ${PointerEventControls} {
      pointer-events: auto;
    }
  }
`;
