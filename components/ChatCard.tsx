import {Avatar} from "@mui/material";
import type {NextComponentType, NextPageContext} from "next";

import styles from "../styles/ChatCard.module.css";
import {Message} from "../props";

interface Props {
  data: {
    User: {name: string; avatar: string};
    messages: Message[] | [];
  };
  UserId: Number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  isSelected: boolean;
}

const ChatCard: NextComponentType<NextPageContext, {}, Props> = ({
  data,
  UserId,
  onClick = () => {},
  isSelected,
}: Props) => {
  const {User, messages = []} = data;
  const {message = "", UserId: UserIdMessage} =
    messages[messages?.length - 1] || {};
  return (
    <div
      className={`${styles.container} ${isSelected ? "bg-zinc-900" : ""}`}
      onClick={onClick}
      role="button"
    >
      <Avatar
        className={styles.avatar}
        src={
          User?.avatar ||
          "https://tronClickmelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
        }
      />
      <div className={styles.textContainer}>
        <span className={styles.textName}>{User?.name}</span>
        <p className={UserIdMessage === UserId ? styles.textMessageSelf : ""}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatCard;
