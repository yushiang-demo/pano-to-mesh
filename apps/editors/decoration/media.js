import { v4 as uuid } from "uuid";
import { DEFAULT_PROPS } from "../../../components/MediaManager/types";

export const getNewMedia = (type, transformation) => {
  if (!transformation) return null;

  const baseProps = {
    id: uuid(),
    transformation,
    type,
    readonly: false,
    data: DEFAULT_PROPS[type],
  };

  return baseProps;
};
