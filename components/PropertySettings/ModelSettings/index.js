import URLInput from "../URLInput";
import { useGLTFAnimationNames } from "@pano-to-mesh/three/hooks";
import Select from "../../Select";

const ModelSettings = ({ data, onChange }) => {
  const animations = useGLTFAnimationNames(data);

  const onChangeClip = (clip) => onChange({ ...data, clip });
  const onChangeTime = (e) => {
    onChange({ ...data, time: e.target.value });
  };
  return (
    <>
      <URLInput data={data} onChange={onChange} />
      <Select
        candidates={animations || []}
        current={data.clip}
        onChange={onChangeClip}
      />
      <input
        type="range"
        min={0}
        max={1 - 1e-3}
        step={1e-3}
        value={data.time}
        onChange={onChangeTime}
      />
    </>
  );
};

export default ModelSettings;
