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
        {
          <div className="bg-white text-zinc-900 dark:text-white dark:bg-black border-l border-l-zinc-200 dark:border-l-zinc-800 min-h-screen">
            Chat Drawer
          </div>
        }
      </Drawer>
    </div>
  );
};

export default ChatDrawer;
