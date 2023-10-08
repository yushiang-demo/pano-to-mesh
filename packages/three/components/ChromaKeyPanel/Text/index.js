import * as THREE from "three";
import { useState, useEffect } from "react";
import ChromaKeyPanel from "../Core";

const getSvgTextURL = (text, fontSize, color) => {
  const breakLineCharacter = "\n";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg">
        ${text
          .split(breakLineCharacter)
          .map((text, index) => {
            return `
            <text x="0" y="${
              index + 1
            }em" font-size="${fontSize}" fill="${color}">
                <tspan xml:space="preserve">${text}</tspan>
            </text>
            `;
          })
          .join(breakLineCharacter)}    
    </svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  return url;
};

const Text = ({ data, ...props }) => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const text = data.text;
    const fontSize = data.fontSize || 32;
    const fontColor = data.fontColor || "#000000";
    const url = getSvgTextURL(text, fontSize, fontColor);

    const texture = new THREE.TextureLoader().load(url);
    setTexture(texture);

    return () => {
      texture.dispose();
    };
  }, [data]);

  return <ChromaKeyPanel {...props} texture={texture} color={data.color} />;
};

export default Text;
