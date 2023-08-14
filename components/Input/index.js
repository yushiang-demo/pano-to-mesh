import { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";

const InputElement = styled.input``;

const Input = ({ onChange, value, candidates }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const onBlur = () => {
    onChange(text);
  };

  const listID = uuid();
  return (
    <>
      <InputElement
        list={listID}
        onChange={handleTextChange}
        value={text}
        onBlur={onBlur}
      />
      <datalist id={listID}>
        {candidates.map((value) => (
          <option value={value} />
        ))}
      </datalist>
    </>
  );
};

export default Input;
