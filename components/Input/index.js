import { useState } from "react";
import styled from "styled-components";

const InputElement = styled.input``;

const Input = ({ onChange, value }) => {
  const [text, setText] = useState(value);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const onBlur = () => {
    onChange(text);
  };
  return (
    <InputElement
      tabIndex={1}
      onChange={handleTextChange}
      value={text}
      onBlur={onBlur}
    />
  );
};

export default Input;
