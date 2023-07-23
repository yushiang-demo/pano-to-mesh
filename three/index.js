import hooks from "./hooks";
import THREEPanoramaOutline from "./components/PanoramaOutline";
import ProjectionMesh from "./components/PanoramaProjectionMesh";
import TextureMesh from "./components/PanoramaTextureMesh";
import Canvas from "./components/ThreeCanvas";
import Math from "./core/helpers/Math";
import { raycastGeometry } from "./core/helpers/Raycaster";
import { getEmptyRoomGeometry, downloadMesh } from "./core/RoomGeometry";

// React components
export const ThreeCanvas = Canvas;
export const PanoramaOutline = THREEPanoramaOutline;
export const PanoramaProjectionMesh = ProjectionMesh;
export const PanoramaTextureMesh = TextureMesh;

// React Hooks
export const Loaders = hooks;

// THREE Algorithm
export const Core = {
  Math,
  raycastGeometry,
  getEmptyRoomGeometry,
  downloadMesh,
};
