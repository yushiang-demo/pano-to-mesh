import styled from "styled-components";

export const Input = styled.input`
  display: none;
`;

export const Label = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
`;

export const Wrapper = styled.div`
  border: 1px solid;
  border-radius: 5px;

  width: 95%;

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
    width: 48%;
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    width: 31%;
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    width: 23%;
  }

  // Extra large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
    width: 18%;
  }
`;
