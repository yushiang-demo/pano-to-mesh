import { fromUint8Array, toUint8Array } from "js-base64";
import { deflate, inflate } from "pako";

export const encodeString = (text) => {
  const data = new TextEncoder().encode(text);
  const compressed = deflate(data, { level: 9 });
  const uint8Array = fromUint8Array(compressed, true);
  return encodeURIComponent(uint8Array);
};

export const decodeString = (text) => {
  const decodedText = decodeURIComponent(text);
  const data = toUint8Array(decodedText);
  return inflate(data, { to: "string" });
};
