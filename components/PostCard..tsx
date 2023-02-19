import type {NextComponentType, NextPageContext} from "next";
import {useState} from "react";

import {red} from "@mui/material/colors";
import {
  Avatar,
  CardActions,
  CardMedia,
  CardHeader,
  Card,
  IconButton,
} from "@mui/material";
import {HeartIcon, ShareIcon, ChatAltIcon} from "@heroicons/react/outline";
import {HeartIcon as HeartIconSolid} from "@heroicons/react/solid";
import Carousel from "react-material-ui-carousel";

import styles from "../styles/PostCard.module.css";

interface Props {
  data: {
    User: {
      avatar: string;
      username: string;
    };
    files: string[];
    caption: string;
  };
}

const PostCard: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    data: {
      User: {avatar = "", username = ""} = {},
      files = [
        "https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg",
        // "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png",
      ],
      caption = "Tayang besok, beli tiket @filmhidayah pake website atau aplikasi CGV buat dapetin promo BUY 1 GET 1. Kuota terbatas, beli tiketnya sekarang! Jangan lupa masukin kode promo: HIDAYAH ya :)",
    } = {},
  } = props;

  const [isLiked, setIsLiked] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);

  const onClickLike = () => {
    setIsLiked(!isLiked);
  };
  const onClickMore = () => {
    setIsShowMore(!isShowMore);
  };

  return (
    <Card sx={{maxWidth: "60vh"}} className={styles.container}>
      <CardHeader
        avatar={
          <Avatar
            sx={{bgcolor: red[500]}}
            aria-label="recipe"
            src={
              avatar ||
              "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
            }
            className="cursor-pointer"
          />
        }
        title={
          <span className={`${styles.title} cursor-pointer`}>{username}</span>
        }
        subheader={
          <span className={`${styles.textSecondary} text-xs`}>
            16 hours ago
          </span>
        }
      />
      <Carousel indicators={files.length > 1 ? true : false}>
        {files.map((url, idx) => (
          <CardMedia
            component="img"
            image={url}
            alt="https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg"
            key={idx}
          />
        ))}
      </Carousel>
      <CardActions disableSpacing>
        {isLiked ? (
          <IconButton
            aria-label="add to favorites"
            className="flex flex-row"
            onClick={onClickLike}
          >
            <HeartIconSolid className={`text-rose-600 h-6 w-6`} />
            <span className={`${styles.text} ml-1`}>0</span>
          </IconButton>
        ) : (
          <IconButton
            aria-label="add to favorites"
            className="flex flex-row"
            onClick={onClickLike}
          >
            <HeartIcon className={`${styles.text} h-6 w-6`} />
            <span className={`${styles.text} ml-1`}>0</span>
          </IconButton>
        )}
        <IconButton aria-label="add to favorites" className="mx-2">
          <ChatAltIcon className={`${styles.text} h-6 w-6`} />
          <span className={`${styles.text} ml-1`}>0</span>
        </IconButton>
        <IconButton aria-label="share" className="flex flex-row">
          <ShareIcon className={`${styles.text} h-6 w-6`} />
          <span className={`${styles.text} ml-1`}>0</span>
        </IconButton>
      </CardActions>
      <div className="px-4 pb-4">
        <p className={`${styles.text}`}>
          <span className={`${styles.text} font-bold`}>{username}</span>{" "}
          {isShowMore
            ? caption
            : `${caption.split("").slice(0, 50).join("")}...`}{" "}
          {!isShowMore && (
            <span
              className={`${styles.textSecondary} cursor-pointer`}
              onClick={onClickMore}
            >
              more
            </span>
          )}
        </p>
      </div>
    </Card>
  );
};

export default PostCard;
