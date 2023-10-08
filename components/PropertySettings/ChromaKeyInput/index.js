import { useEffect, useState } from "react";
import { Wrapper, RowWrapper, Button, Input } from "../styled";
const ChromaKeyInput = ({ data, onChange }) => {
  const [url, setURL] = useState(data.src);
  const [color, setColor] = useState(data.color);

  const reset = () => {
    setURL(data.src);
    setColor(`#${data.color?.toString(16).toUpperCase()}`);
  };

  useEffect(reset, [data]);

  const onType = (e) => {
    setURL(e.target.value);
  };

  const onChangeColor = (e) => {
    setColor(e.target.value);
  };

  const onSave = () => {
    onChange({
      src: url,
      color: parseInt(color.substring(1), 16),
    });
  };

  return (
    <Wrapper>
      <RowWrapper>
        <Input value={url} onChange={onType} />
        <Input type="color" value={color} onChange={onChangeColor} />
      </RowWrapper>
      <RowWrapper>
        <Button onClick={reset}> Cancel</Button>
        <Button onClick={onSave}> Save</Button>
      </RowWrapper>
    </Wrapper>
  );
};

export default ChromaKeyInput;
