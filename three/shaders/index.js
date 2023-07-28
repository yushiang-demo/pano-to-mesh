import cubemapToEquirectangular, {
  setUniforms as cubemapToEquirectangularUniforms,
} from "./fragmentShaders/cubemapToEquirectangular";
import edgeDetection from "./fragmentShaders/edgeDetection";
import dilation, {
  setUniforms as dilationUniforms,
} from "./fragmentShaders/dilation";
import vertexColor from "./fragmentShaders/vertexColor";
import equirectangularProjection, {
  setUniforms as equirectangularProjectionUniforms,
} from "./fragmentShaders/equirectangularProjection";
import faceNormal from "./fragmentShaders/faceNormal";
import textureBlending, {
  setUniforms as textureBlendingUniforms,
} from "./fragmentShaders/textureBlending";
import texture, {
  setUniforms as textureUniforms,
} from "./fragmentShaders/texture";
import screenPosition from "./vertexShaders/screenPosition";
import worldPosition from "./vertexShaders/worldPosition";
import uvPosition from "./vertexShaders/uvPosition";

export default {
  vertexShaders: { worldPosition, screenPosition, uvPosition },
  fragmentShaders: {
    vertexColor,
    edgeDetection,
    dilation,
    faceNormal,
    texture,
    textureBlending,
    equirectangularProjection,
    cubemapToEquirectangular,
  },
  setUniforms: {
    equirectangularProjection: equirectangularProjectionUniforms,
    cubemapToEquirectangular: cubemapToEquirectangularUniforms,
    texture: textureUniforms,
    textureBlending: textureBlendingUniforms,
    dilation: dilationUniforms,
  },
};
