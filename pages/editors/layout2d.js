import React from "react";
import Editor from "../../apps/editors/layout2d";
import { useDecodedHash } from "../../hooks/useHash";

const Apps = () => {
  const { data, isLoading } = useDecodedHash();
  return !isLoading && <Editor data={data} />;
};

export default Apps;
