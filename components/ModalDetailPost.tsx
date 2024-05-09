import type {NextComponentType, NextPageContext} from "next";
import {useState, useMemo, useEffect, useRef} from "react";
import {useRouter} from "next/router";
import moment from "moment";

import {CardMedia, Avatar, CardHeader, Card} from "@mui/material";
import {Modal, Box, Divider, CardActions, IconButton} from "@mui/material";
import {
  HeartIcon,
  ShareIcon,
  ChatAltIcon,
  EmojiHappyIcon,
} from "@heroicons/react/outline";
import {HeartIcon as HeartIconSolid} from "@heroicons/react/solid";
import Carousel from "react-material-ui-carousel";
import EmojiPicker, {Theme} from "emoji-picker-react";
import * as Alert from "../components/Alert";
import ModalDevelopment from "./ModalDevelopment";

import styles from "../styles/ModalDetailPost.module.css";
import {createPostCommentApi, likeUnLikeApi} from "../store/api";
import {useSelector} from "react-redux";
import {PostComment, PostLike} from "../props";

interface Props {
  open: boolean;
  toggle: Function;
  data:
    | {
        id: number;
        User: {
          avatar: string;
          username: string;
        };
        files: string[];
        PostComments: PostComment[];
        PostLikes: PostLike[];
        caption: string;
        createdAt: string | Date;
      }
    | any;
  index: number;
  handleLike: Function;
  handleComment: Function;
}

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  boxShadow: 24,
};

const ModalCreate: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    open,
    toggle,
    data: {
      id: PostId = 0,
      User: {avatar = "", username = ""} = {},
      files = [
        "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png",
      ],
      caption,
      PostLikes = [],
      PostComments = [],
      createdAt = new Date(),
    } = {},
    index,
    handleLike = () => {},
    handleComment = () => {},
  } = props;
  const router = useRouter();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const {accessToken = "", id: ownUserId = 0} =
    useSelector(
      (state: {
        rootReducer: {
          session: {accessToken: string; id: number};
        };
      }) => state?.rootReducer?.session
    ) || {};

  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showModalDevelopment, setShowModalDevelopment] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  const toggleModalDevelopment = () =>
    setShowModalDevelopment(!showModalDevelopment);

  const Content = useMemo(() => {
    const handleChangeCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e?.target?.value);
    };

    const onEmojiClick = (emojiObject: {emoji: string}) => {
      setComment((prevInput) => prevInput + emojiObject.emoji);
      setShowEmojiPicker(false);
    };

    const commentCard = (data: {
      avatar: string;
      comment: string;
      username: string;
      idx: number;
    }) => {
      const onClickProfile = () => {
        toggle();
        router.push(`/${data?.username}`);
      };
      return (
        <div className={`flex flex-row lg:p-4 mt-4`} key={data?.idx}>
          <div onClick={onClickProfile} className="cursor-pointer">
            <Avatar
              className="rounded-full w-7 h-7 mr-4"
              src={
                data?.avatar ||
                "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
              }
            />
          </div>
          <p className={`${styles.caption}`}>
            <span
              className={`${styles.text} font-bold cursor-pointer`}
              onClick={onClickProfile}
            >
              {data?.username}
            </span>{" "}
            {data?.comment}
          </p>
        </div>
      );
    };

    const handlePostComment = async () => {
      try {
        if (loadingComment || !comment?.length) return;
        setLoadingComment(true);
        const {data: dataComment} = await createPostCommentApi({
          accessToken,
          data: {PostId, comment},
        });
        setComment("");
        if (dataComment?.data) {
          handleComment(index, dataComment?.data);
        }
      } catch (err) {
        Alert.Error("Error create comment");
      }
    };

    const onClickLike = async () => {
      try {
        if (loadingLike) return;
        setLoadingLike(true);
        const {data: dataLike} = await likeUnLikeApi({
          accessToken,
          data: {PostId},
        });
        if (dataLike?.data) {
          handleLike(index, dataLike?.data);
        }
      } catch (err) {
        Alert.Error("Error like post");
      } finally {
        setLoadingLike(false);
      }
    };

    return (
      <div className="flex flex-col lg:flex-row">
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
          className="lg:hidden"
        />
        <Carousel
          indicators={files.length > 1 ? true : false}
          navButtonsAlwaysInvisible={files.length > 1 ? false : true}
          className="lg:hidden"
        >
          {files.map((url: string, idx: number) => (
            <CardMedia
              component="img"
              image={url}
              alt="https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg"
              key={idx}
              sx={{maxHeight: "50vh"}}
            />
          ))}
        </Carousel>
        <CardActions disableSpacing className="lg:hidden">
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
          <IconButton aria-label="add to favorites" className="mx-2">
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
        <div className="px-4 pb-4 lg:hidden">
          <p className={`${styles.caption}`}>
            <span className={`${styles.text} font-bold`}>{username}</span>{" "}
            {caption}
          </p>
          {[...PostComments].map((e: PostComment, idx: number) =>
            commentCard({
              avatar: e?.User?.avatar || "",
              username: e?.User?.username,
              comment: e?.comment,
              idx: idx + 1,
            })
          )}
          <div className="horizontal justify-between mt-4">
            <textarea
              placeholder="Add a comment..."
              className={`${styles.textarea}`}
              value={comment}
              onChange={handleChangeCaption}
              ref={textAreaRef}
              rows={1}
              maxLength={255}
            />
            <span
              className={`${
                comment?.length && !loadingComment
                  ? "text-primary"
                  : "text-zinc-400"
              } font-semibold`}
              role="button"
              onClick={handlePostComment}
            >
              Post
            </span>
          </div>
          <div className="horizontal justify-between">
            <EmojiHappyIcon
              className="w-5 h-5 text-zinc-400"
              role="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            <small className={styles.textSecondary}>
              {comment?.length}/255
            </small>
          </div>
        </div>
        <div className="flex-col justify-center w-2/3 hidden lg:flex">
          <Carousel
            indicators={files.length > 1 ? true : false}
            navButtonsAlwaysInvisible={files.length > 1 ? false : true}
          >
            {files.map((url: string, idx: number) => (
              <CardMedia
                component="img"
                image={url}
                alt="https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg"
                key={idx}
                sx={{maxHeight: "80vh"}}
              />
            ))}
          </Carousel>
        </div>
        <div
          className="flex-col p-4 justify-between hidden lg:flex"
          style={{width: 400, minHeight: 600}}
        >
          <div>
            <CardHeader
              avatar={
                <Avatar
                  aria-label="recipe"
                  src={
                    avatar ||
                    "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
                  }
                  className="cursor-pointer"
                  onClick={() => {
                    toggle();
                    router.push(`/${username}`);
                  }}
                />
              }
              title={
                <span
                  className={`${styles.title} cursor-pointer`}
                  onClick={() => {
                    toggle();
                    router.push(`/${username}`);
                  }}
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
            <Divider className="dark:bg-zinc-400" />
            <div className={styles.commentsContainer}>
              {commentCard({avatar, comment: caption || "", username, idx: 0})}
              {PostComments.map(
                (
                  e: {
                    User: {avatar: string; username: string};
                    comment: string;
                  },
                  idx: number
                ) =>
                  commentCard({
                    avatar: e?.User?.avatar || "",
                    username: e?.User?.username,
                    comment: e?.comment,
                    idx: idx + 1,
                  })
              )}
            </div>
          </div>
          <div className="vertical">
            <CardActions disableSpacing className="px-0">
              {isLiked ? (
                <IconButton
                  aria-label="add to favorites"
                  className="flex flex-row pl-0"
                  onClick={onClickLike}
                >
                  <HeartIconSolid className={`text-rose-600 h-5 w-5`} />
                  <span className={`${styles.text} ml-1`}>
                    {PostLikes?.length}
                  </span>
                </IconButton>
              ) : (
                <IconButton
                  aria-label="add to favorites"
                  className="flex flex-row pl-0"
                  onClick={onClickLike}
                >
                  <HeartIcon className={`${styles.text} h-5 w-5`} />
                  <span className={`${styles.text} ml-1`}>
                    {PostLikes?.length}
                  </span>
                </IconButton>
              )}
              <IconButton aria-label="add to favorites" className="mx-2">
                <ChatAltIcon className={`${styles.text} h-5 w-5`} />
                <span className={`${styles.text} ml-1`}>
                  {PostComments?.length}
                </span>
              </IconButton>
              <IconButton
                aria-label="share"
                className="flex flex-row pl-0"
                onClick={toggleModalDevelopment}
              >
                <ShareIcon className={`${styles.text} h-5 w-5`} />
                <span className={`${styles.text} ml-1`}>0</span>
              </IconButton>
            </CardActions>
            <div className="horizontal justify-between">
              <textarea
                placeholder="Add a comment..."
                className={`${styles.textarea}`}
                value={comment}
                onChange={handleChangeCaption}
                ref={textAreaRef}
                rows={1}
                maxLength={255}
              />
              <span
                className={`${
                  comment?.length && !loadingComment
                    ? "text-primary"
                    : "text-zinc-400"
                } font-semibold`}
                role="button"
                onClick={handlePostComment}
              >
                Post
              </span>
            </div>
            <div className="horizontal justify-between">
              <EmojiHappyIcon
                className="w-7 h-7 text-zinc-400"
                role="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              <small className={styles.textSecondary}>
                {comment?.length}/255
              </small>
            </div>
            {showEmojiPicker && (
              <EmojiPicker theme={Theme.AUTO} onEmojiClick={onEmojiClick} />
            )}
          </div>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    files,
    username,
    avatar,
    comment,
    showEmojiPicker,
    router,
    PostId,
    caption,
    PostComments,
    isLiked,
    PostLikes,
    loadingComment,
  ]);

  // Updates the height of a <textarea> when the value changes.
  const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string
  ) => {
    useEffect(() => {
      if (textAreaRef) {
        // We need to reset the height momentarily to get the correct scrollHeight for the textarea
        textAreaRef.style.height = "0px";
        const scrollHeight = textAreaRef.scrollHeight;

        // We then set the height directly, outside of the render loop
        // Trying to set this with state or a ref will product an incorrect value.
        textAreaRef.style.height = scrollHeight + "px";
      }
    }, [textAreaRef, value]);
  };
  useAutosizeTextArea(textAreaRef.current, comment);

  useEffect(() => {
    if (PostLikes) {
      const isFound = PostLikes.find((e: PostLike) => e?.UserId === ownUserId);
      if (isFound) setIsLiked(true);
      else setIsLiked(false);
    }
  }, [PostLikes, ownUserId]);

  useEffect(() => {
    setComment("");
  }, [open]);

  return (
    <>
      <ModalDevelopment
        open={showModalDevelopment}
        toggle={toggleModalDevelopment}
        feature="Share"
      />
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => toggle()}
        sx={{zIndex: 1059}}
      >
        <Box
          sx={{...boxStyle}}
          className="bg-white dark:bg-zinc-800 rounded-lg h-5/6  overflow-y-scroll"
        >
          {Content}
        </Box>
      </Modal>
    </>
  );
};

export default ModalCreate;
