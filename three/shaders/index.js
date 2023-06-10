import cubemapToEquirectangular, {
  setUniforms as cubemapToEquirectangularUniforms,
} from "./fragmentShaders/cubemapToEquirectangular";
import edgeDetection from "./fragmentShaders/edgeDetection";
import vertexColor from "./fragmentShaders/vertexColor";
import equirectangularProjection, {
  setUniforms as equirectangularProjectionUniforms,
} from "./fragmentShaders/equirectangularProjection";
import faceNormal from "./fragmentShaders/faceNormal";
import textureBlending, {
  setUniforms as textureBlendingUniforms,
} from "./fragmentShaders/textureBlending";
import screenPosition from "./vertexShaders/screenPosition";
import worldPosition from "./vertexShaders/worldPosition";

export default {
  vertexShaders: { worldPosition, screenPosition },
  fragmentShaders: {
    vertexColor,
    edgeDetection,
    faceNormal,
    textureBlending,
    equirectangularProjection,
    cubemapToEquirectangular,
  },
  setUniforms: {
    equirectangularProjection: equirectangularProjectionUniforms,
    cubemapToEquirectangular: cubemapToEquirectangularUniforms,
    textureBlending: textureBlendingUniforms,
  },
};
