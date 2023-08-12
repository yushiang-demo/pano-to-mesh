import React from "react";
import Viewer from "../apps/viewer";
import useQueryString from "../hooks/useQueryString";

const Apps = () => {
  const { data } = useQueryString();
  return <Viewer data={data} />;
};

export default Apps;
