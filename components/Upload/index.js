import Icons from "../Icon";
import { Input, Wrapper, Label } from "./styled";
const Upload = ({ onFileChange }) => {
  const onChange = (e) => {
    const { files } = e.target;
    const length = files.length;
    Array.from({ length }).forEach((_, index) => {
      const file = files[index];
      const formData = new FormData();
      formData.append("file", file);
      onFileChange(formData);
    });
  };

  return (
    <Wrapper>
      <Label htmlFor="file-upload">
        <Icons.add />
      </Label>
      <Input
        multiple
        id="file-upload"
        type="file"
        onChange={onChange}
        accept=".png, .jpg, .jpeg"
      />
    </Wrapper>
  );
};

export default Upload;
