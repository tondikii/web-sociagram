import type {NextComponentType, NextPageContext} from "next";
import {Drawer, CardMedia} from "@mui/material";
import {ChatAlt2Icon} from "@heroicons/react/outline";
import styles from "../styles/ChatDrawer.module.css";
import {useState} from "react";

interface Props {
  className: string;
}

const ChatDrawer: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {className} = props;
  const [showDrawer, setShowDrawer] = useState(false);

  const onClickDrawer = () => {
    setShowDrawer(!showDrawer);
  };
  return (
    <div
      className={`${styles.container} p-4 fixed min-h-screen hidden ${className}`}
    >
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
          <CardMedia
            component="img"
            className="w-80"
            image={"/restrict-development.svg"}
          />
          <span>Chat feature is under development</span>
        </div>
      </Drawer>
    </div>
  );
};

export default ChatDrawer;
