import { useRouter } from "next/router";
import Icons from "../Icon";
import { FloatDiv, Item } from "./styled";
import { useEffect, useState } from "react";

const RouterSwitch = ({ data }) => {
  const router = useRouter();

  const extendsLink = (link) => {
    const path = new URL(link, window.location.href);
    path.hash = window.location.hash;
    return path;
  };

  const redirectTo = (link) => {
    return () => {
      router.push(extendsLink(link));
    };
  };

  const needsHighlight = (link) => {
    return router.pathname === link;
  };

  return (
    <FloatDiv>
      {data.map(({ link, Icon }) => (
        <Item key={link} onClick={redirectTo(link)}>
          <Icon $highlight={needsHighlight(link)} />
        </Item>
      ))}
    </FloatDiv>
  );
};

const DataWrapper = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      {
        link: "/editors/layout2d",
        Icon: Icons.panorama,
      },
      {
        link: "/editors/layout3d",
        Icon: Icons.cube,
      },
      {
        link: "/editors/decoration",
        Icon: Icons.arrange,
      },
      {
        link: "/",
        Icon: Icons.preview,
      },
    ]);
  }, []);

  return <RouterSwitch data={data} />;
};

export default DataWrapper;
