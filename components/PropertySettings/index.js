import { DEFAULT_PROPS, MEDIA_2D, MEDIA_3D } from "../MediaManager/types";
import Select from "../Select";
import TextInput from "./TextInput";
import URLInput from "./URLInput";
import ChromaKeyInput from "./ChromaKeyInput";

const PropertyInputs = {
  [MEDIA_2D.TEXT]: TextInput,
  [MEDIA_2D.HTML_IMAGE]: URLInput,
  [MEDIA_2D.HTML_VIDEO]: URLInput,
  [MEDIA_2D.HTML_IFRAME]: URLInput,
  [MEDIA_2D.SHADER_IMAGE]: ChromaKeyInput,
  [MEDIA_2D.SHADER_VIDEO]: ChromaKeyInput,
  [MEDIA_3D.MODAL]: URLInput,
};

const getCandidates = (type) => {
  const categorize = [MEDIA_2D, MEDIA_3D];

  const category = categorize.find((category) =>
    Object.values(category).includes(type)
  );

  return Object.values(category);
};

const PropertySetting = ({ type, data, onChange }) => {
  const candidates = getCandidates(type);

  const onTypeChange = (type) => {
    onChange(type, DEFAULT_PROPS[type]);
  };

  const onDataChange = (data) => {
    onChange(type, data);
  };

  const InputComponent = PropertyInputs[type];
  return (
    <>
      <Select candidates={candidates} current={type} onChange={onTypeChange} />
      {InputComponent && <InputComponent data={data} onChange={onDataChange} />}
    </>
  );
};

export default PropertySetting;
