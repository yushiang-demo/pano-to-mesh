import { useState, forwardRef, useMemo } from "react";

import { MeshIndexMap } from "@pano-to-mesh/three";
import useMesh from "./useMesh";
import { MEDIA_3D } from "../MediaManager/types";
import { useUpdateModel } from "@pano-to-mesh/three/hooks";

const Basic = (props) => {
  useMesh(props);
  return null;
};

const Model = (props) => {
  const mesh = useMesh(props);
  useUpdateModel(mesh, props.data);
  return null;
};

const ObjectSelector = ({ media, mouse, ...props }, ref) => {
  const [raycasterMeshes, setRaycasterMeshes] = useState([]);

  const updateRaycasterMesh = useMemo(
    () =>
      media.map((_, idx) => {
        return (mesh) => {
          setRaycasterMeshes((prev) => {
            const copy = [...prev];
            copy[idx] = mesh;
            return copy;
          });
        };
      }),
    [media]
  );

  return (
    <>
      {media.map((data, index) => {
        const Component = data.type === MEDIA_3D.MODEL ? Model : Basic;
        return (
          <Component
            key={data.id}
            type={data.type}
            data={data.data}
            transformation={data.transformation}
            updateRaycasterMesh={updateRaycasterMesh[index]}
          />
        );
      })}
      <MeshIndexMap
        meshes={raycasterMeshes}
        mouse={mouse}
        ref={ref}
        {...props}
      />
    </>
  );
};

export default forwardRef(ObjectSelector);
