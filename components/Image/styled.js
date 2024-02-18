import styled from "styled-components";

export const Wrapper = styled.div`
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

  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
`;

export const Container = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56%;
`;

export const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  border-radius: 5px;

  background-image: url("${(props) => props.src}");
`;
