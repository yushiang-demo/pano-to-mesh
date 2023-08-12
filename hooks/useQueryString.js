import { decodeString } from "../helpers/pako";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useQueryString = () => {
  const [data, setData] = useState(null);
  const router = useRouter();
  const encodedData = router.query?.data;

  useEffect(() => {
    try {
      if (encodedData) {
        const decoded = decodeString(encodedData);
        setData(JSON.parse(decoded));
      }
    } catch (e) {
      console.error(e);
    }
  }, [encodedData]);

  return { data };
};

export default useQueryString;
