import { MEDIA } from "../../../components/MediaManager/types";

export const getNewMedia = (type, transformation) => {
  if (!transformation) return null;

  const baseProps = {
    transformation,
    type,
    readonly: false,
    data: {},
  };

  if (type === MEDIA.HTML_IFRAME) {
    return {
      ...baseProps,
      data: {
        html: `<div style="background:gray; width:100%; height:100%"/>`,
        resolution: [1, 1],
      },
    };
  }

  if (type === MEDIA.MODAL) {
    return {
      ...baseProps,
      data: {},
    };
  }

  console.warn(`type ${type} not defined return empty media`);
  return baseProps;
};
