import React from "react";
import { Css3DObject, Placeholder } from "@pano-to-mesh/three";

import RawHTML from "./RawHTML";
import { MEDIA } from "./types";

const MediaManager = ({ three, data, readonly: globalReadonly }) => {
  const getMediaByType = ({
    transformation,
    type,
    data,
    readonly: objectReadonly,
  }) => {
    if (type === MEDIA.HTML_IFRAME) {
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

    if (type === MEDIA.PLACEHOLDER_3D) {
      return <Placeholder.Modal three={three} {...transformation} />;
    }

    if (type === MEDIA.PLACEHOLDER_2D) {
      return <Placeholder.Plane three={three} {...transformation} />;
    }
  };

  return data.map((prop, index) => (
    <React.Fragment key={index}>{getMediaByType(prop)}</React.Fragment>
  ));
};

export default MediaManager;
