import styled from "styled-components";

export const Button = styled.div`
  flex: 1;
  border-radius: 5px;
  background-color: rgb(200, 200, 200);
  padding: 3px;
  text-align: center;
  cursor: pointer;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 10px;
  gap: 5px;
`;

export const RowWrapper = styled.div`
  display: flex;
  gap: 10px;
  padding: 5px 0px;
`;

export const Input = styled.input`
  border-radius: 5px;

  &:focus {
    outline: none;
  }
`;
