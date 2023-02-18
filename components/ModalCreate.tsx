import type {NextComponentType, NextPageContext} from "next";
import {useRef, useState, useMemo, useCallback} from "react";
import {getDownloadURL, ref, uploadBytesResumable} from "@firebase/storage";
import {storage} from "../config/firebase";

import {CardMedia} from "@mui/material";
import {Modal, Box, Divider, Button} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  EmojiHappyIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/outline";
import Carousel from "react-material-ui-carousel";
import EmojiPicker from "emoji-picker-react";

import styles from "../styles/ModalCreate.module.css";

interface Props {
  open: boolean;
  toggle: Function;
  username: string;
  avatar: string;
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
  {label: "Crop", value: 2},
  {label: "Create new post", value: 3},
];

const ModalSearch: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {open, toggle, username, avatar} = props;
  const fileRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [caption, setCaption] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onClickFile = () => {
    fileRef.current.click();
  };

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files || [];
      setFiles(files || []);
      console.log({files});
      const tempPreview = [];
      for (let i = 0; i < files.length; i++) {
        tempPreview.push(URL.createObjectURL(files[i]));
      }
      setPreview(tempPreview);
      setCurrentStep(steps[1]?.value);
    },
    []
  );

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
            className="bg-primary"
          >
            Post
          </Button>
        )}
      </div>
    );
  }, [currentStep]);

  const Content = useMemo(() => {
    const uploadFiles = () => {
      if (!files.length) return;
      console.log({files});
      for (let i = 0; i < files.length; i++) {
        console.log({file: files[i]});
        const storageRef = ref(storage, `files/${files[i]?.name}`);
        const uploadTask = uploadBytesResumable(storageRef, files[i]);
        console.log("sini");
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log({url});
        });
      }
    };

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
                height="194"
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
                    height="194"
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
                <img
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
                  style={{minHeight: 200}}
                />
                <EmojiHappyIcon
                  className="w-6 h-6 text-zinc-400"
                  role="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                {showEmojiPicker && (
                  <EmojiPicker theme="auto" onEmojiClick={onEmojiClick} />
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
    files,
    currentStep,
    handleChangeFile,
    preview,
    username,
    avatar,
    caption,
    showEmojiPicker,
  ]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={() => toggle()}
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

export default ModalSearch;
