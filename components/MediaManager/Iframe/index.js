import { Iframe, PointerEvents } from "./styled";

const IframeContainer = ({ src }) => {
  return (
    <PointerEvents tabIndex={0}>
      <Iframe src={src} />
    </PointerEvents>
  );
};

export default IframeContainer;
