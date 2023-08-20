import React from "react";
import Viewer from "../apps/viewer";
import { useDecodedHash } from "../hooks/useHash";

const Apps = () => {
  const { data, isLoading } = useDecodedHash();
  return !isLoading && <Viewer data={data} />;
};

export default Apps;
