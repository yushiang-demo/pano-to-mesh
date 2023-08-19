import { useState, useEffect } from "react";
import { encodeString, decodeString } from "../helpers/pako";

export const useStoreDataToHash = (data) => {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const rawString = JSON.stringify(data);
    const encodedString = encodeString(rawString);
    setHash(encodedString);
    window.location.hash = encodedString;
  }, [data]);

  return hash;
};

export const useDecodedHash = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash) {
        const decoded = decodeString(hash);
        setData(JSON.parse(decoded));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return data;
};
