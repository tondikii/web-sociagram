import type {NextComponentType, NextPageContext} from "next";
import {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
  Fragment,
} from "react";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {storage} from "../config/firebase";
import {useRouter} from "next/router";

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
import {createPostApi} from "../store/api";
import useMutation from "../hooks/useMutation";
import {setRefetchPost} from "../store/reducers/root";
import {useDispatch} from "react-redux";

interface Props {
  open: boolean;
  toggle: Function;
  username: string;
  avatar: string;
}

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
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
  const {open, toggle, username, avatar} = props;
  const dispatch = useDispatch();

  const fileRef = useRef<HTMLInputElement>(
    typeof window === "object" ? document.createElement("input") : null
  );

  const [files, setFiles] = useState<Array<never> | FileList>([]);
  const [preview, setPreview] = useState<Array<string>>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [caption, setCaption] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setFiles([]);
    setPreview([]);
    setCurrentStep(1);
    setCaption("");
    setShowEmojiPicker(false);
    setLoading(false);
  };

  const [createPost, {data, error}, resetCreatePost]: any[] =
    useMutation(createPostApi);

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
        createPost({
          accessToken: localStorage.getItem("accessToken"),
          data: {
            caption,
            files: result,
          },
        });
      })
      .catch((err) => {
        Alert.Error(err);
        setLoading(false);
      });
  }, [files, createPost, caption]);

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
        <span className="text-md md:text-lg lg:text-xl font-medium">
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
            className="bg-primary flex flex-row text-xs md:text-base"
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

    const FormComponent = () => (
      <Fragment>
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
          <div className="flex flex-row-reverse lg:flex-row  lg:justify-between">
            <EmojiHappyIcon
              className="w-7 h-7 text-zinc-400 hidden lg:block"
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
      </Fragment>
    );

    switch (currentStep) {
      case steps[1]?.value:
        return (
          <Fragment>
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
          </Fragment>
        );
      case steps[2]?.value:
        return (
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col justify-center w-full lg:w-2/3">
              <Carousel indicators={preview.length > 1 ? true : false}>
                {preview.map((url, idx) => (
                  <div
                    key={idx}
                    className="flex flex-column justify-center lg:block"
                  >
                    <CardMedia
                      component="img"
                      sx={{maxHeight: "45vw", maxWidth: "45vw"}}
                      image={url}
                      alt="https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg"
                      className="lg:hidden block"
                    />
                    <CardMedia
                      component="img"
                      sx={{maxHeight: "80vh"}}
                      image={url}
                      alt="https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg"
                      className="lg:block hidden"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            <div className="flex flex-col p-4 w-full lg:hidden">
              {FormComponent()}
            </div>
            <div
              className="hidden lg:flex flex-col p-4"
              style={{width: 300, minHeight: 600}}
            >
              {FormComponent()}
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
    if (data) {
      dispatch(setRefetchPost(true));
      toggle();
      reset();
      resetCreatePost();
    }
  }, [data, resetCreatePost, toggle, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.Error("Failed create post");
    }
  }, [error]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={() => toggle()}
      sx={{zIndex: 1059}}
    >
      <Box sx={boxStyle}>
        <div
          style={{width: "90vw", maxHeight: "82vh"}}
          className="bg-white dark:bg-zinc-800 rounded-lg lg:hidden"
        >
          {Header}
          <Divider className="dark:bg-zinc-400" />
          {Content}
        </div>
        <div
          className="bg-white dark:bg-zinc-800 rounded-lg hidden lg:flex flex-col"
          style={{
            width: currentStep === steps[2].value ? 900 : 600,
          }}
        >
          {Header}
          <Divider className="dark:bg-zinc-400" />
          {Content}
        </div>
      </Box>
    </Modal>
  );
};

export default ModalCreate;
