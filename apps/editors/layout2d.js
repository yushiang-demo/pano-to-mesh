import React, { useMemo, useState } from "react";

import { Loaders, PanoramaOutline, ThreeCanvas } from "@pano-to-mesh/three";
import useClick2AddWalls from "../../hooks/useClick2AddWalls";
import PageContainer from "../../components/PageContainer";
import Input from "../../components/Input";
import Icons from "../../components/Icon";
import Toolbar from "../../components/Toolbar";
import RatioLockedDiv from "../../components/RatioLockedDiv";
import { useStoreDataToHash } from "../../hooks/useHash";

const dev = process.env.NODE_ENV === "development";
const Editor = ({ data }) => {
  const [imageSrc, setImageSrc] = useState(data.panorama);
  const panorama = Loaders.useTexture({ src: imageSrc });
  const [panoramaOrigin, setPanoramaOrigin] = useState(data.panoramaOrigin);
  const [floorY] = useState(data.floorY);
  const [ceilingY, setCeilingY] = useState(data.ceilingY);
  const geometryInfo = useMemo(
    () => ({
      floorY,
      ceilingY,
    }),
    [floorY, ceilingY]
  );
  const { layout2D, eventHandlers, imageCoord } = useClick2AddWalls({
    defaultData: data.layout2D,
    panoramaOrigin,
    geometryInfo,
    selectThresholdPixel: 5,
  });

  const props = {
    ...data,
    floorY,
    ceilingY,
    layout2D,
    panorama,
    panoramaOrigin,
  };

  useStoreDataToHash({
    ...props,
    layout2D: imageCoord,
    panorama: imageSrc,
  });

  const onChange = (value) => {
    setImageSrc(value);
  };

  return (
    <PageContainer>
      <Toolbar>
        <Icons.panorama />
        <Input
          onChange={onChange}
          value={imageSrc}
          candidates={[
            "https://as1.ftcdn.net/v2/jpg/05/34/28/38/1000_F_534283809_qJ4LqArfGQ51g8X3RuwmLpo6ATUdXngR.jpg",
            "https://as1.ftcdn.net/v2/jpg/01/89/08/78/1000_F_189087887_OBrl3f117Yicp94SBhFwMyxVgbN5Nfcb.jpg",
          ]}
        />
        {!!layout2D.length && (
          <>
            <Icons.cube />
            <input
              type="number"
              value={ceilingY}
              onChange={(e) => setCeilingY(e.target.value)}
              min={panoramaOrigin[1]}
              max={panoramaOrigin[1] + 10}
              step={1e-2}
            />
            <Icons.camera />
            <input
              type="number"
              value={panoramaOrigin[1]}
              onChange={(e) =>
                setPanoramaOrigin((value) => [
                  value[0],
                  Math.min(parseFloat(e.target.value), ceilingY),
                  value[2],
                ])
              }
              min={1.0}
              max={5.0}
              step={1e-2}
            />
          </>
        )}
      </Toolbar>
      <RatioLockedDiv>
        <ThreeCanvas {...eventHandlers} dev={dev}>
          <PanoramaOutline {...props} />
        </ThreeCanvas>
      </RatioLockedDiv>
    </PageContainer>
  );
};

const PropsParser = ({ data }) => {
  return (
    <Editor
      data={
        data || {
          panorama: "",
          panoramaOrigin: [0, 1.5, 0],
          floorY: 0,
          ceilingY: 2.0,
          layout2D: [],
        }
      }
    />
  );
};

export default PropsParser;
