import { Wrapper, PointerEventControls } from "./styled";

const RawHTML = ({ content }) => {
  return (
    <Wrapper tabIndex={0}>
      <PointerEventControls
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </Wrapper>
  );
};

export default RawHTML;
