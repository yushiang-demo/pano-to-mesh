import { useState, useEffect, forwardRef, useMemo } from "react";

import { Media, MeshIndexMap } from "@pano-to-mesh/three";
import { MEDIA_2D, MEDIA_3D } from "../MediaManager/types";

const Mesh = ({ type, data, transformation, updateRaycasterMesh }) => {
  const [mesh, setMesh] = useState(null);
  useEffect(() => {
    const getMesh = async (type) => {
      if (type === MEDIA_3D.PLACEHOLDER_3D) {
        return Media.getBoxMesh();
      } else if (type === MEDIA_3D.MODAL) {
        return await Media.getModal(data);
      } else if (Object.values(MEDIA_2D).includes(type)) {
        return Media.getPlaneMesh();
      }
    };

    getMesh(type).then(setMesh);
  }, [type, data]);

  useEffect(() => {
    if (!mesh) return;
    mesh.setTransform(transformation);
    updateRaycasterMesh(mesh);

    return () => {
      updateRaycasterMesh(null);
    };
  }, [mesh, transformation, updateRaycasterMesh]);

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
      {media.map((data, index) => (
        <Mesh
          key={index}
          type={data.type}
          data={data.data}
          transformation={data.transformation}
          updateRaycasterMesh={updateRaycasterMesh[index]}
        />
      ))}
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
