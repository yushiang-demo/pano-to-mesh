import RouterSwitch from "../components/RouteSwitch";
export default function App({ Component, pageProps }) {
  return (
    <>
      <RouterSwitch />
      <Component {...pageProps} />;
    </>
  );
}
