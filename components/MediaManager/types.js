export const MEDIA_2D = {
  TEXT: "Text",
  HTML_IMAGE: "Image",
  HTML_IFRAME: "Iframe",
  HTML_VIDEO: "Video",
  SHADER_IMAGE: "Shader Image",
  SHADER_VIDEO: "Shader Video",
  PLACEHOLDER_2D: "Placeholder 2D",
};

export const MEDIA_3D = {
  MODAL: "Mesh",
  PLACEHOLDER_3D: "Placeholder 3D",
};

export const MEDIA = {
  ...MEDIA_2D,
  ...MEDIA_3D,
};
