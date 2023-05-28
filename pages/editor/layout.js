import React from "react";
import { useRouter } from "next/router";
import Editor from "@/components/Editor";

function ImagePreviewPage() {
  const router = useRouter();

  // Get the data URL from the query string parameters
  const image = router.query.image;

  return <>{image && <Editor src={image} />}</>;
}

export default ImagePreviewPage;
