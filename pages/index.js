import React from "react";
import Viewer from "../apps/viewer";
import { useDecodedHash } from "../hooks/useHash";

const Apps = () => {
  const data = useDecodedHash();
  return <Viewer data={data} />;
};

export default Apps;
