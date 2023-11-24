import {Avatar} from "@mui/material";
import type {NextComponentType, NextPageContext} from "next";

import styles from "../styles/ChatCard.module.css";

interface Props {
  data: {
    avatar: string;
    name: string;
    message: string | undefined;
  };
  onClick: React.MouseEventHandler<HTMLDivElement>;
  isSelected: boolean;
}

const ChatCard: NextComponentType<NextPageContext, {}, Props> = ({
  data,
  onClick = () => {},
  isSelected,
}: Props) => {
  const {name, message, avatar} = data;
  return (
    <div
      className={`${styles.container} ${isSelected ? "bg-zinc-900" : ""}`}
      onClick={onClick}
      role="button"
    >
      <Avatar
        className={styles.avatar}
        src={
          avatar ||
          "https://tronClickmelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
        }
      />
      <div className={styles.textContainer}>
        <span className={styles.textName}>{name}</span>
        <p className={styles.textMessage}>{message}</p>
      </div>
    </div>
  );
};

export default ChatCard;
