import { useEffect, useState } from "react";
import { Wrapper, RowWrapper, Button, Input } from "../styled";
const URLInput = ({ data, onChange }) => {
  const [url, setURL] = useState(data.src);

  useEffect(() => {
    setURL(data.src);
  }, [data]);

  const onType = (e) => {
    setURL(e.target.value);
  };

  const onCancel = () => {
    setURL(data.src);
  };

  const onSave = () => {
    onChange({
      src: url,
    });
  };

  return (
    <Wrapper>
      <Input
        value={url}
        onChange={onType}
        onMouseDown={(e) => e.stopPropagation()}
      />
      <RowWrapper>
        <Button onClick={onCancel}> Cancel</Button>
        <Button onClick={onSave}> Save</Button>
      </RowWrapper>
    </Wrapper>
  );
};

export default URLInput;
