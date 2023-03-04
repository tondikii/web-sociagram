import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import Sidebar from "./Sidebar";
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
    // <div className="min-h-screen flex flex-row justify-between">
    <div className="min-h-screen flex flex-col-reverse justify-between">
      <Sidebar className="hidden" />
      <div className={`${styles.content} bg-custom-zinc`}>{children}</div>
      <ChatDrawer />
    </div>
  );
};

Layout.defaultProps = {children: <></>};

export default Layout;
