import type {NextComponentType, NextPageContext} from "next";
import {useRef, useState, useMemo, useCallback, useEffect} from "react";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {storage} from "../config/firebase";
import {connect} from "react-redux";
import {useRouter} from "next/router";

import {
  createPosts as createPostsProps,
  getPosts as getPostsProps,
} from "../store/actions";

import {Avatar, CardMedia} from "@mui/material";
import {Modal, Box, Divider, Button} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  EmojiHappyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/outline";
import Carousel from "react-material-ui-carousel";
import EmojiPicker, {Theme} from "emoji-picker-react";
import ReactLoading from "react-loading";
import * as Alert from "../components/Alert";

import styles from "../styles/ModalCreate.module.css";

interface Props {
  open: boolean;
  toggle: Function;
  username: string;
  avatar: string;
  createPosts: Function;
  createPostsState: {
    fetch: boolean;
    data: {postId: string};
    error: string[] | string;
  };
  getPosts: Function;
}

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  boxShadow: 24,
};

const steps = [
  {label: "Create new post", value: 1},
  {label: "Preview", value: 2},
  {label: "Create new post", value: 3},
];

const ModalCreate: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    open,
    toggle,
    username,
    avatar,
    createPosts,
    createPostsState: {
      data: {postId},
    },
    getPosts,
  } = props;
  const router = useRouter();
  const {username: usernameQuery = ""} = router.query;

  const fileRef = useRef<HTMLInputElement>(
    typeof window === "object" ? document.createElement("input") : null
  );

  const [files, setFiles] = useState<Array<never> | FileList>([]);
  const [preview, setPreview] = useState<Array<string>>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [caption, setCaption] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onClickFile = () => {
    if (fileRef?.current) {
      fileRef?.current.click();
    }
  };

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files || [];
      setFiles(files || []);
      const tempPreview = [];
      for (let i = 0; i < files.length; i++) {
        tempPreview.push(URL.createObjectURL(files[i]));
      }
      setPreview(tempPreview);
      setCurrentStep(steps[1]?.value);
    },
    []
  );

  const handleClickPost = useCallback(() => {
    setLoading(true);
    const tempUrls: Promise<unknown>[] = [];
    for (let i = 0; i < files.length; i++) {
      const uploadFiles = new Promise(async (resolve, reject) => {
        try {
          const directory = `posts/${new Date().getTime()}-${files[i]?.name}`;
          const storageRef = ref(storage, directory);
          await uploadBytes(storageRef, files[i]);
          const url = await getDownloadURL(storageRef);
          resolve(url);
        } catch (err: any) {
          switch (err.code) {
            case "storage/object-not-found":
              reject("File doesn't exist");
              break;
            case "storage/unauthorized":
              reject("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              reject("User canceled the upload");
              break;
            default:
              reject("Unknown error occurred, inspect the server response");
              break;
          }
        }
      });
      tempUrls.push(uploadFiles);
    }
    Promise.all(tempUrls)
      .then((result) => {
        createPosts({
          accessToken: localStorage.getItem("accessToken"),
          data: {
            caption,
            files: result,
          },
        });
      })
      .catch((err) => {
        Alert.Error({text: err});
        setLoading(false);
      });
  }, [files, createPosts, caption]);

  const Header = useMemo(() => {
    const changeStep = (action: string) => {
      if (action === "previous") {
        setCurrentStep(currentStep - 1);
      } else if (action === "next") {
        setCurrentStep(currentStep + 1);
      }
    };
    return (
      <div className="p-4 flex justify-between items-center">
        {currentStep !== steps[0].value && (
          <ArrowLeftIcon
            className={styles.icon}
            onClick={() => changeStep("previous")}
          />
        )}
        <span className="text-xl font-medium">
          {steps[currentStep - 1].label}
        </span>
        {currentStep !== steps[2].value && currentStep !== steps[0].value && (
          <ArrowRightIcon
            className={styles.icon}
            onClick={() => changeStep("next")}
          />
        )}
        {currentStep === steps[2].value && (
          <Button
            variant="contained"
            style={{textTransform: "none"}}
            className="bg-primary flex flex-row"
            onClick={handleClickPost}
            disabled={loading}
          >
            {loading && (
              <ReactLoading
                type="spin"
                height={16}
                width={16}
                color="white"
                className="mr-2"
              />
            )}
            {loading ? "Loading..." : "Post"}
          </Button>
        )}
      </div>
    );
  }, [currentStep, handleClickPost, loading]);

  const Content = useMemo(() => {
    const handleChangeCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCaption(e?.target?.value);
    };

    const onEmojiClick = (emojiObject: {emoji: string}) => {
      setCaption((prevInput) => prevInput + emojiObject.emoji);
      setShowEmojiPicker(false);
    };

    switch (currentStep) {
      case steps[1]?.value:
        return (
          <Carousel indicators={preview.length > 1 ? true : false}>
            {preview.map((url, idx) => (
              <CardMedia
                component="img"
                sx={{maxHeight: "80vh"}}
                image={url}
                alt="https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg"
                key={idx}
              />
            ))}
          </Carousel>
        );
      case steps[2]?.value:
        return (
          <div className="flex flex-row">
            <div className="flex flex-col justify-center w-2/3">
              <Carousel indicators={preview.length > 1 ? true : false}>
                {preview.map((url, idx) => (
                  <CardMedia
                    component="img"
                    sx={{maxHeight: "80vh"}}
                    image={url}
                    alt="https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg"
                    key={idx}
                  />
                ))}
              </Carousel>
            </div>
            <div
              className="flex flex-col p-4"
              style={{width: 300, minHeight: 600}}
            >
              <div className="flex flex-row items-center mb-4">
                <Avatar
                  className="rounded-full w-7 h-7"
                  src={
                    avatar ||
                    "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
                  }
                />
                <p className="ml-2 font-bold text-sm">{username}</p>
              </div>
              <div className="vertical">
                <textarea
                  placeholder="Write a caption..."
                  className={`${styles.textarea}`}
                  value={caption}
                  onChange={handleChangeCaption}
                  maxLength={255}
                />
                <div className="horizontal justify-between">
                  <EmojiHappyIcon
                    className="w-7 h-7 text-zinc-400"
                    role="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  />
                  <small className={styles.textSecondary}>
                    {caption?.length}/255
                  </small>
                </div>
                {showEmojiPicker && (
                  <EmojiPicker theme={Theme.AUTO} onEmojiClick={onEmojiClick} />
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="verticalCenter p-4 my-24">
            <AddPhotoAlternateIcon className="text-9xl mb-4" />
            <Button
              variant="contained"
              style={{textTransform: "none"}}
              className="bg-primary"
              onClick={onClickFile}
            >
              Select from computer
            </Button>
            <input
              type="file"
              hidden
              ref={fileRef}
              accept="image/*"
              multiple={true}
              onChange={handleChangeFile}
            />
          </div>
        );
    }
  }, [
    currentStep,
    handleChangeFile,
    preview,
    username,
    avatar,
    caption,
    showEmojiPicker,
  ]);

  useEffect(() => {
    if (loading && postId) {
      setLoading(false);
      toggle();
      getPosts({
        accessToken: localStorage.getItem("accessToken"),
        data: username === usernameQuery ? username : "",
      });
    }
  }, [loading, postId, toggle, getPosts, username, usernameQuery]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={() => toggle()}
      sx={{zIndex: 1059}}
    >
      <Box
        sx={{...boxStyle, width: currentStep === steps[2].value ? 900 : 600}}
        className="bg-white dark:bg-zinc-800 rounded-lg"
      >
        {Header}
        <Divider className="dark:bg-zinc-400" />
        {Content}
      </Box>
    </Modal>
  );
};

const mapStateToProps = (state: {rootReducer: {createPosts: Object}}) => ({
  createPostsState: state.rootReducer.createPosts,
});

const mapDispatchToProps = {
  createPosts: (payload: {
    accessToken: string;
    data: {caption: string; files: string[]};
  }) => createPostsProps(payload),
  getPosts: (payload: {accessToken: string; data: string}) =>
    getPostsProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreate);
