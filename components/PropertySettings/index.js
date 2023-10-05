import { useEffect, useState } from "react";
import { MEDIA_2D, MEDIA_3D } from "../MediaManager/types";
import Select from "../Select";

const getCandidates = (type) => {
  const categorize = [MEDIA_2D, MEDIA_3D];

  const category = categorize.find((category) =>
    Object.values(category).includes(type)
  );

  return Object.values(category);
};

const PropertySetting = ({ type, data, onChange }) => {
  const [currentType, setCurrentType] = useState(type);

  useEffect(() => {
    setCurrentType(type);
  }, [type]);

  const candidates = getCandidates(type);

  return (
    <>
      <Select
        candidates={candidates}
        current={currentType}
        onChange={setCurrentType}
      />
    </>
  );
};

export default PropertySetting;
