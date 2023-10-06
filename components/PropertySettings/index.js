import { DEFAULT_PROPS, MEDIA_2D, MEDIA_3D } from "../MediaManager/types";
import Select from "../Select";

const getCandidates = (type) => {
  const categorize = [MEDIA_2D, MEDIA_3D];

  const category = categorize.find((category) =>
    Object.values(category).includes(type)
  );

  return Object.values(category);
};

const PropertySetting = ({ type, onChange }) => {
  const candidates = getCandidates(type);

  const onTypeChange = (type) => {
    onChange(type, DEFAULT_PROPS[type]);
  };

  return (
    <>
      <Select candidates={candidates} current={type} onChange={onTypeChange} />
    </>
  );
};

export default PropertySetting;
