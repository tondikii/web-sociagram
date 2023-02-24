import type {NextComponentType, NextPageContext} from "next";
import {useEffect, useMemo, useState} from "react";
import {connect} from "react-redux";
import {useRouter} from "next/router";

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
import {likeUnLike as likeUnLikeProps} from "../store/actions";
import ModalDetailPost from "./ModalDetailPost";

import styles from "../styles/PostCard.module.css";

interface Props {
  data: {
    postId: string;
    User: {
      avatar: string;
      username: string;
    };
    files: string[];
    likes: string[];
    caption: string;
  };
  likeUnLike: Function;
  likeUnLikeState: {
    fetch: boolean;
    data: {
      postId: string;
      likes: string[];
    };
    error: string;
  };
}

const PostCard: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    data: {
      postId,
      User: {avatar = "", username = ""} = {},
      files = [
        "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png",
      ],
      caption,
      likes,
    } = {},
    likeUnLike,
    likeUnLikeState: {
      data: {postId: newPostId, likes: newLikes},
    },
  } = props;
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);

  const toggleModalDetail = () => {
    setShowModalDetail(!showModalDetail);
  };

  const usedLikes: string[] | undefined = useMemo(() => {
    if (postId === newPostId && newLikes?.length) {
      return newLikes;
    }
    return likes;
  }, [likes, newLikes, postId, newPostId]);

  const onClickLike = () => {
    setIsLiked(!isLiked);
    likeUnLike({
      accessToken: localStorage.getItem("accessToken"),
      data: {postId},
    });
  };
  const onClickMore = () => {
    setIsShowMore(!isShowMore);
  };

  useEffect(() => {
    if (usedLikes) {
      const userId = localStorage.getItem("userId");
      const isFound = usedLikes.find((id) => id === userId);
      if (isFound) setIsLiked(true);
      else setIsLiked(false);
    }
  }, [usedLikes]);

  return (
    <>
      <ModalDetailPost
        open={showModalDetail}
        toggle={toggleModalDetail}
        data={{postId, User: {avatar, username}, files, caption, likes}}
      />
      <Card sx={{width: "34rem"}} className={styles.container}>
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
              onClick={() => router.push(`/${username}`)}
            />
          }
          title={
            <span
              className={`${styles.title} cursor-pointer`}
              onClick={() => router.push(`/${username}`)}
            >
              {username}
            </span>
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
              <span className={`${styles.text} ml-1`}>{usedLikes?.length}</span>
            </IconButton>
          ) : (
            <IconButton
              aria-label="add to favorites"
              className="flex flex-row"
              onClick={onClickLike}
            >
              <HeartIcon className={`${styles.text} h-6 w-6`} />
              <span className={`${styles.text} ml-1`}>{usedLikes?.length}</span>
            </IconButton>
          )}
          <IconButton
            aria-label="add to favorites"
            className="mx-2"
            onClick={toggleModalDetail}
          >
            <ChatAltIcon className={`${styles.text} h-6 w-6`} />
            <span className={`${styles.text} ml-1`}>0</span>
          </IconButton>
          <IconButton aria-label="share" className="flex flex-row">
            <ShareIcon className={`${styles.text} h-6 w-6`} />
            <span className={`${styles.text} ml-1`}>0</span>
          </IconButton>
        </CardActions>
        <div className="px-4 pb-4">
          <p className={`${styles.caption}`}>
            <span className={`${styles.text} font-bold`}>{username}</span>{" "}
            {isShowMore || caption.length <= 50
              ? caption
              : `${caption.split("").slice(0, 50).join("")}...`}{" "}
            {!isShowMore && caption.length > 50 && (
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
    </>
  );
};

const mapStateToProps = (state: {
  rootReducer: {
    likeUnLike: Object;
  };
}) => ({
  likeUnLikeState: state.rootReducer.likeUnLike,
});
const mapDispatchToProps = {
  likeUnLike: (payload: {accessToken: string; data: {postId: string}}) =>
    likeUnLikeProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(PostCard);
