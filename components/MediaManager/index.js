import React from "react";
import {
  Css3DObject,
  Placeholder,
  ChromaKeyPanel,
  GLBModel,
} from "@pano-to-mesh/three";
import { MEDIA_2D, MEDIA_3D } from "./types";
import CssImage from "./CssImage";
import Video from "./Video";
import Iframe from "./Iframe";

const CSS3D_MEDIA = {
  [MEDIA_2D.HTML_IFRAME]: Iframe,
  [MEDIA_2D.HTML_VIDEO]: Video,
  [MEDIA_2D.HTML_IMAGE]: CssImage,
};

const MediaManager = ({ three, data, readonly: globalReadonly }) => {
  const getMediaByType = ({
    transformation,
    type,
    data,
    readonly: objectReadonly,
  }) => {
    if (type in CSS3D_MEDIA) {
      const Component = CSS3D_MEDIA[type];
      return (
        <Css3DObject
          three={three}
          {...transformation}
          resolution={data.resolution}
          readonly={globalReadonly || objectReadonly}
        >
          <Component src={data.src} />
        </Css3DObject>
      );
    }

    if (type === MEDIA_2D.TEXT) {
      return (
        <ChromaKeyPanel.Text three={three} {...transformation} data={data} />
      );
    }

    if (type === MEDIA_2D.SHADER_IMAGE) {
      return (
        <ChromaKeyPanel.Image three={three} {...transformation} data={data} />
      );
    }

    if (type === MEDIA_2D.SHADER_VIDEO) {
      return (
        <ChromaKeyPanel.Video three={three} {...transformation} data={data} />
      );
    }

    if (type === MEDIA_3D.MODEL) {
      return <GLBModel three={three} {...transformation} data={data} />;
    }

    if (type === MEDIA_3D.PLACEHOLDER_3D) {
      return <Placeholder.Model three={three} {...transformation} />;
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
