import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import SideBarNav from "./SideBarNav";
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
    <div className="min-h-screen flex flex-col lg:flex-row lg:justify-between mb-10 lg mb:0">
      <SideBarNav />
      <div className={styles.content}>{children}</div>
      <BottomBar />
      <ChatDrawer />
    </div>
  );
};

Layout.defaultProps = {children: <></>};

export default Layout;
