import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  left: calc(
    ${(props) => (props.index / props.length) * 100}% +
      ${(props) => (props.index + 1) * 10}px
  );
  width: calc(
    ${(props) => (1 / props.length) * 100}% -
      ${(props) => (props.length + 1) * 10}px
  );
  height: ${(props) => (((1 / props.length) * 100) / 16) * 9}%;
  top: 10px;
  z-index: 2;

  * {
    border-radius: 10px;
    pointer-events: none;
  }
  &:hover {
    * {
      border: 1px solid black;
    }
  }

  transition: width 0.7s, height 0.7s, left 0.7s;
  &:focus-within {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;

    &:hover {
      border: none;
    }

    * {
      outline: none;
      border: none;
      border-radius: 0px;
      pointer-events: auto;
    }
  }
`;

const CanvasSwitch = ({ children }) => {
  return children.map((child, index) => (
    <Wrapper
      tabIndex={index}
      key={index}
      length={children.length}
      index={index}
    >
      {child}
    </Wrapper>
  ));
};

export default CanvasSwitch;
