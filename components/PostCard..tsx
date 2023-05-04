import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import {useEffect, useMemo, useState} from "react";
import moment from "moment";

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
import ModalDetailPost from "./ModalDetailPost";
import ModalDevelopment from "./ModalDevelopment";
import * as Alert from "../components/Alert";

import styles from "../styles/PostCard.module.css";
import {likeUnLikeApi} from "../store/api";
import useMutation from "../hooks/useMutation";
import {useSelector} from "react-redux";

interface PostCommentUser {
  id: number;
  username: string;
  avatar: string;
}

interface PostComment {
  id: number;
  comment: string;
  User: PostCommentUser;
}

interface PostLike {
  id: number;
  PostId: number;
  UserId: number;
}

interface User {
  username: string;
  avatar: string;
}

interface Post {
  id: number;
  files: string[];
  caption: string;
  UserId: number;
  User: User;
  createdAt: string;
  PostComments: PostComment[];
  PostLikes: PostLike[];
}

interface Props {
  data: Post;
  ownUserId: number;
}

const PostCard: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {data, ownUserId} = props;
  const {
    id: PostId,
    PostComments = [],
    User: {avatar = "", username = ""} = {},
    files = [
      "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png",
    ],
    caption = "",
    PostLikes = [],
    createdAt = new Date(),
  } = data || {};

  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalDevelopment, setShowModalDevelopment] = useState(false);

  const [likeUnLike, {loading: loadingLike, error: errorLike}]: any[] =
    useMutation(likeUnLikeApi);

  const toggleModalDetail = () => {
    setShowModalDetail(!showModalDetail);
  };
  const toggleModalDevelopment = () =>
    setShowModalDevelopment(!showModalDevelopment);

  const onClickLike = async () => {
    try {
      if (loadingLike) return;
      await likeUnLike({
        data: {PostId},
      });
      router.replace(router.asPath);
    } catch (err) {
      console.error(err);
    }
  };
  const onClickMore = () => {
    setIsShowMore(!isShowMore);
  };

  useEffect(() => {
    if (errorLike) {
      Alert.Error("Error like post");
    }
  }, [errorLike]);

  useEffect(() => {
    if (PostLikes) {
      const isFound = PostLikes.find((e: PostLike) => e?.UserId === ownUserId);
      if (isFound) setIsLiked(true);
      else setIsLiked(false);
    }
  }, [PostLikes, ownUserId]);

  return (
    <>
      <ModalDevelopment
        open={showModalDevelopment}
        toggle={toggleModalDevelopment}
        feature="Share"
      />
      <ModalDetailPost
        open={showModalDetail}
        toggle={toggleModalDetail}
        data={data}
      />
      <Card className={styles.container}>
        <CardHeader
          avatar={
            <Avatar
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
              {moment(createdAt).startOf("day").fromNow()}
            </span>
          }
        />
        <Carousel
          indicators={files.length > 1 ? true : false}
          navButtonsAlwaysInvisible={files.length > 1 ? false : true}
        >
          {files.map((url, idx) => (
            <CardMedia
              component="img"
              image={url}
              alt="https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg"
              key={idx}
              sx={{maxHeight: "60vh"}}
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
              <span className={`${styles.text} ml-1`}>{PostLikes?.length}</span>
            </IconButton>
          ) : (
            <IconButton
              aria-label="add to favorites"
              className="flex flex-row"
              onClick={onClickLike}
            >
              <HeartIcon className={`${styles.text} h-6 w-6`} />
              <span className={`${styles.text} ml-1`}>{PostLikes?.length}</span>
            </IconButton>
          )}
          <IconButton
            aria-label="add to favorites"
            className="mx-2"
            onClick={toggleModalDetail}
          >
            <ChatAltIcon className={`${styles.text} h-6 w-6`} />
            <span className={`${styles.text} ml-1`}>
              {PostComments?.length}
            </span>
          </IconButton>
          <IconButton
            aria-label="share"
            className="flex flex-row"
            onClick={toggleModalDevelopment}
          >
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

export default PostCard;
