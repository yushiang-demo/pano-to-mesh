import { Css3DObject } from "../../three";

import RawHTML from "./RawHTML";
import { MEDIA } from "../../constant/media";

const MediaManager = ({ three, data }) => {
  const getMediaByType = ({ content, type }) => {
    if (type === MEDIA.HTML) {
      return <RawHTML content={content} />;
    }
  };

  return data.map(({ props, ...item }, index) => (
    <Css3DObject three={three} key={index} {...props}>
      {getMediaByType(item)}
    </Css3DObject>
  ));
};

export default MediaManager;
