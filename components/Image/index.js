import { Wrapper, Content, Container } from "./styled";

const Image = ({ url, onClick }) => {
  return (
    <Wrapper onClick={onClick}>
      <Container>
        <Content src={url} />
      </Container>
    </Wrapper>
  );
};

export default Image;
