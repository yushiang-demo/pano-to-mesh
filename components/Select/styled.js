import styled from "styled-components";

export const Current = styled.div`
  &::before {
    display: inline-flex;
    content: "\\25BC";
    transform: rotate(-90deg);
    padding: 0px 5px;
  }
`;

export const Menu = styled.div`
  display: none;

  flex-direction: column;
  gap: 5px;
  padding: 5px 0px;
  margin: 5px 0px;
  background: white;
  box-shadow: 3px 3px 10px #aaaaaa;
`;

export const MenuItem = styled.div`
  cursor: pointer;
  padding: 3px;
  &:hover {
    background: #dddddd;
  }
`;

export const HighlightMenuItem = styled.div`
  cursor: pointer;
  padding: 3px;
  background: #aaaaaa;
`;

export const Wrapper = styled.div`
  padding: 10px;
  cursor: pointer;

  &:focus-within {
    ${Menu} {
      display: flex;
    }
    ${Current} {
      pointer-events: none;
      &::before {
        transform: rotate(0);
      }
    }
  }
`;
