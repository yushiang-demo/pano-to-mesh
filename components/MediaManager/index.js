import React from "react";
import { Css3DObject, Placeholder } from "@pano-to-mesh/three";
import { MEDIA_2D, MEDIA_3D } from "./types";
import CssImage from "./CssImage";
import Video from "./Video";
import Iframe from "./Iframe";

const MediaManager = ({ three, data, readonly: globalReadonly }) => {
  const getMediaByType = ({
    transformation,
    type,
    data,
    readonly: objectReadonly,
  }) => {
    if (type === MEDIA_2D.HTML_VIDEO) {
      return (
        <Css3DObject
          three={three}
          {...transformation}
          resolution={data.resolution}
          readonly={globalReadonly || objectReadonly}
        >
          <Video src={data.src} />
        </Css3DObject>
      );
    }

    if (type === MEDIA_2D.HTML_IMAGE) {
      return (
        <Css3DObject
          three={three}
          {...transformation}
          resolution={data.resolution}
          readonly={globalReadonly || objectReadonly}
        >
          <CssImage src={data.src} />
        </Css3DObject>
      );
    }

    if (type === MEDIA_2D.TEXT) {
      return (
        <Css3DObject
          three={three}
          {...transformation}
          resolution={data.resolution}
          readonly={globalReadonly || objectReadonly}
        >
          {JSON.stringify(data)}
        </Css3DObject>
      );
    }

    if (type === MEDIA_2D.HTML_IFRAME) {
      return (
        <Css3DObject
          three={three}
          {...transformation}
          resolution={data.resolution}
          readonly={globalReadonly || objectReadonly}
        >
          <Iframe src={data.src} />
        </Css3DObject>
      );
    }

    if (type === MEDIA_3D.PLACEHOLDER_3D) {
      return <Placeholder.Modal three={three} {...transformation} />;
    }

    if (type === MEDIA_2D.PLACEHOLDER_2D) {
      return <Placeholder.Plane three={three} {...transformation} />;
    }
  };

  return data.map((prop, index) => (
    <React.Fragment key={index}>{getMediaByType(prop)}</React.Fragment>
  ));
};

export default MediaManager;
