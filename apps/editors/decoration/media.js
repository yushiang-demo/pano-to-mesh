import { DEFAULT_PROPS } from "../../../components/MediaManager/types";

export const getNewMedia = (type, transformation) => {
  if (!transformation) return null;

  const baseProps = {
    transformation,
    type,
    readonly: false,
    data: DEFAULT_PROPS[type],
  };

  return baseProps;
};
