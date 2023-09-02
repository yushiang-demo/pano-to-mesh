import styled, { css } from "styled-components";

// when wrap icon with empty div will make parent height bigger then icon
const avoidParentHeightPadding = `
  vertical-align: top;
`;

export const Image = styled.div`
  ${avoidParentHeightPadding}
  width: 100%;
  height: 100%;
  display: inline-block;
  cursor: pointer;
  ${(props) =>
    props.src &&
    css`
      background-image: url("${props.src}");
      background-size: cover;
    `};
`;

export const Wrapper = styled.div`
  width: 24px;
  height: 24px;
  background: ${(props) => (props.$highlight ? "white" : "transparent")};
  border-radius: 50%;
  padding: 5px;
`;

const Icon = ({ src, ...props }) => {
  return (
    <Wrapper {...props}>
      <Image src={src} {...props} alt={src} />
    </Wrapper>
  );
};

// all svg resources is download from https://www.svgrepo.com/vectors/cursor/
const IconFolder = `/icons`;
const files = {
  download: `${IconFolder}/download.svg`,
  panorama: `${IconFolder}/panorama.svg`,
  camera: `${IconFolder}/camera.svg`,
  cube: `${IconFolder}/cube.svg`,
  activated3D: `${IconFolder}/activated3D.svg`,
  inactivated3D: `${IconFolder}/inactivated3D.svg`,
  share: `${IconFolder}/share.svg`,
  cursor: `${IconFolder}/cursor.svg`,
  placeholder: `${IconFolder}/placeholder.svg`,
  box: `${IconFolder}/box.svg`,
  axis: `${IconFolder}/axis.svg`,
};

const Icons = Object.keys(files).reduce((acc, key) => {
  acc[key] = (props) => <Icon src={files[key]} {...props} />;
  return acc;
}, {});

export default Icons;
