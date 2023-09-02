import { MEDIA } from "../../../constant/media";

export const getNewMedia = (type, transformation) => {
  if (!transformation) return null;

  const baseProps = {
    transformation,
    type,
    readonly: false,
    data: {},
  };

  if (type === MEDIA.HTML) {
    return {
      ...baseProps,
      data: {
        html: `<div style="background:gray; width:100%; height:100%"/>`,
        resolution: [1, 1],
      },
    };
  }
};
