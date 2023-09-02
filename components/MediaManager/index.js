import React from "react";
import { Css3DObject } from "../../three";

import RawHTML from "./RawHTML";
import { MEDIA } from "../../constant/media";

const MediaManager = ({ three, data, readonly: globalReadonly }) => {
  const getMediaByType = ({
    transformation,
    type,
    data,
    readonly: objectReadonly,
  }) => {
    if (type === MEDIA.HTML) {
      return (
        <Css3DObject
          three={three}
          {...transformation}
          resolution={data.resolution}
          readonly={globalReadonly || objectReadonly}
        >
          <RawHTML content={data.html} />
        </Css3DObject>
      );
    }
  };

  return data.map((prop, index) => (
    <React.Fragment key={index}>{getMediaByType(prop)}</React.Fragment>
  ));
};

export default MediaManager;
