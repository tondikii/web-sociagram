import type {NextComponentType, NextPageContext} from "next";
import styles from "../styles/UserCard.module.css";
import {Avatar} from "@mui/material";

interface Props {
  user: {
    avatar: string;
    username: string;
    name: string;
  };
  key: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const UserCard: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    user: {avatar, username, name},
    key,
    onClick = () => {},
  } = props;
  return (
    <div
      className={`${styles.userCard} ${key === 0 ? "mt-1" : ""}`}
      key={key}
      onClick={onClick}
    >
      <Avatar
        className="rounded-full w-8 lg:w-14 h-8 lg:h-14"
        src={
          avatar ||
          "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
        }
        alt="https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
      />
      <div className="flex flex-col ml-4">
        <span className="font-medium text-sm lg:text-lg">
          {username || "-"}
        </span>
        <span className="text-zinc-400 text-sm lg:text-md">{name || "-"}</span>
      </div>
    </div>
  );
};

export default UserCard;
