import type {NextComponentType, NextPageContext} from "next";
import {Drawer} from "@mui/material";
import {ChatAlt2Icon} from "@heroicons/react/outline";
import styles from "../styles/ChatDrawer.module.css";
import {useState} from "react";

interface Props {}

const ChatDrawer: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const [showDrawer, setShowDrawer] = useState(false);

  const onClickDrawer = (e: MouseEvent) => {
    e.preventDefault();
    setShowDrawer(!showDrawer);
  };
  return (
    <div className={`${styles.container} p-4 fixed min-h-screen`}>
      <div
        className={`${styles.menuContainer} p-1 rounded-full cursor-pointer`}
        onClick={onClickDrawer}
      >
        <ChatAlt2Icon className="text-primary h-8 w-8" />
      </div>
      <Drawer
        anchor={"right"}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      >
        <div className="flex flex-col justify-center items-center p-4 bg-white dark:bg-black text-black dark:text-white h-full">
          <img src="/restrict-development.svg" className="w-80" />
          <span>Chat feature is under development</span>
        </div>
      </Drawer>
    </div>
  );
};

export default ChatDrawer;
