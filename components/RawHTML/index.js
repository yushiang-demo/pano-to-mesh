import { Wrapper } from "./styled";

const RawHTML = ({ content }) => {
  return (
    <Wrapper
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};

export default RawHTML;
