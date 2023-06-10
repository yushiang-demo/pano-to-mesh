import React from "react";
import { useRouter } from "next/router";
import Editor from "../apps";

const Apps = ()=>{
  const router = useRouter();

  const image = router.query.image;

  return <>{image && <Editor src={image} />}</>;
}

export default Apps;
