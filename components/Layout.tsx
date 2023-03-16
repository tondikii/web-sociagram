import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import SideBar from "./SideBar";
import BottomBar from "./BottomBar";
import ChatDrawer from "./ChatDrawer";

import styles from "../styles/Layout.module.css";

interface Props {
  children: JSX.Element;
}

const Layout: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {children} = props;
  const router = useRouter();

  if (router?.asPath === "/signup" || router?.asPath === "/signin")
    return <div className="layout">{children}</div>;

  return (
    // <div className="min-h-screen flex flex-row justify-between"> desktop
    <>
      <div className="min-h-screen flex flex-col justify-between">
        <SideBar className="hidden" />
        <div className={`${styles.content} bg-custom-zinc`}>{children}</div>
        <BottomBar />
        <ChatDrawer className="hidden" />
      </div>
    </>
  );
};

Layout.defaultProps = {children: <></>};

export default Layout;
