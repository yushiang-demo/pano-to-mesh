import styled, { css } from "styled-components";

// when wrap icon with empty div will make parent height bigger then icon
const avoidParentHeightPadding = `
  vertical-align: top;
`;

export const Image = styled.div`
  ${avoidParentHeightPadding}
  width: 24px;
  height: 24px;
  display: inline-block;
  cursor: pointer;
  ${(props) =>
    props.src &&
    css`
      background-image: url("${props.src}");
      background-size: cover;
    `};
`;

const Icon = ({ src, ...props }) => {
  return <Image src={src} {...props} />;
};

// all svg resources is download from https://www.svgrepo.com/vectors/cursor/
const IconFolder = `/icons`;
const files = {
  download: `${IconFolder}/download.svg`,
  panorama: `${IconFolder}/panorama.svg`,
  camera: `${IconFolder}/camera.svg`,
  cube: `${IconFolder}/cube.svg`,
};

const Icons = Object.keys(files).reduce((acc, key) => {
  acc[key] = (props) => <Icon src={files[key]} {...props} />;
  return acc;
}, {});

export default Icons;
