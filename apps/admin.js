import Upload from "../components/Upload";
import GridLayout from "../components/GridLayout";
import PageContainer from "../components/PageContainer";
import Image from "../components/Image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Core } from "@pano-to-mesh/three";
import { encodeString } from "@pano-to-mesh/base64";

const fetchAll = (callback) => {
  fetch(process.env.NEXT_PUBLIC_DULA_NET_ADMIN_TASKS)
    .then((data) => data.json())
    .then((data) => callback(data.tasks))
    .catch((e) => console.error(e));
};

const postImage = (formData, callback) => {
  const api = process.env.NEXT_PUBLIC_DULA_NET_TASK;
  const method = "POST";
  const xhr = new XMLHttpRequest();
  xhr.open(method, api, true);
  xhr.onload = callback;
  xhr.send(formData);
};

const getTask = (uuid, callback) => {
  fetch(`${process.env.NEXT_PUBLIC_DULA_NET_TASK}?id=${uuid}`)
    .then((data) => data.json())
    .then((data) => {
      if (data.output) {
        const {
          layout,
          images: { aligned },
        } = data.output;

        const { cameraHeight, layoutHeight } = layout;

        const point3dToCoords = (point) => {
          const { longitude, latitude } =
            Core.Math.coordinates.cartesian2Spherical(
              point[0] - 0,
              point[1] - cameraHeight,
              point[2] - 0
            );
          const { x, y } = Core.Math.coordinates.spherical2NormalizedXY(
            longitude,
            latitude
          );
          return [1 - x, y];
        };

        const coords = layout.layoutPoints.points.map(({ xyz }) =>
          point3dToCoords(xyz)
        );

        const viewer = {
          ceilingY: layoutHeight,
          floorY: 0,
          layout2D: coords,
          panorama: aligned,
          panoramaOrigin: [0, cameraHeight, 0],
        };

        callback(viewer);
      }
    })
    .catch((e) => console.error(e));
};

const Admin = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchAll(setTasks);
  }, []);

  const onFileChange = (formData) => {
    postImage(formData, () => {
      fetchAll(setTasks);
    });
  };

  const onClickFactory = (uuid) => {
    return () => {
      getTask(uuid, (data) => {
        const hash = encodeString(JSON.stringify(data));
        router.push(`/editors/layout2d#${hash}`);
      });
    };
  };

  return (
    <PageContainer>
      <GridLayout>
        <Upload onFileChange={onFileChange} />
        {tasks.map((data) => (
          <Image
            key={data.uuid}
            url={data.input}
            onClick={onClickFactory(data.uuid)}
          />
        ))}
      </GridLayout>
    </PageContainer>
  );
};

export default Admin;
