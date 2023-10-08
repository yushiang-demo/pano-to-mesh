import { useEffect, useState } from "react";
import { TextureArea } from "./styled";
import { Wrapper, RowWrapper, Button } from "../styled";
const TextInput = ({ data, onChange }) => {
  const [text, setText] = useState(data.text);

  useEffect(() => {
    setText(data.text);
  }, [data]);

  const onType = (e) => {
    setText(e.target.value);
  };

  const onCancel = () => {
    setText(data.text);
  };

  const onSave = () => {
    onChange({
      text,
    });
  };

  return (
    <Wrapper>
      <TextureArea value={text} onChange={onType} rows={5} />
      <RowWrapper>
        <Button onClick={onCancel}> Cancel</Button>
        <Button onClick={onSave}> Save</Button>
      </RowWrapper>
    </Wrapper>
  );
};

export default TextInput;
