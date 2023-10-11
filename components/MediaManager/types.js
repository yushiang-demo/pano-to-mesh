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

export const DEFAULT_PROPS = {
  [MEDIA_2D.TEXT]: { text: "Text" },
  [MEDIA_2D.HTML_IMAGE]: { src: "/resources/media.png" },
  [MEDIA_2D.HTML_IFRAME]: { src: "/resources/media.html" },
  [MEDIA_2D.HTML_VIDEO]: { src: "/resources/media.mp4" },
  [MEDIA_2D.SHADER_IMAGE]: { src: "/resources/media.png", color: 0xffffff },
  [MEDIA_2D.SHADER_VIDEO]: { src: "/resources/media.mp4", color: 0xffffff },
  [MEDIA_2D.PLACEHOLDER_2D]: {},
  [MEDIA_3D.MODAL]: { src: "/resources/Xbot.glb", clip: "idle" },
  [MEDIA_3D.PLACEHOLDER_3D]: {},
};
