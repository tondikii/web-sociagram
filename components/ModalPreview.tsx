import type {NextComponentType, NextPageContext} from "next";

import {CardMedia} from "@mui/material";
import {Modal, Box, Divider} from "@mui/material";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/outline";

import styles from "../styles/ModalPreview.module.css";

interface Props {
  open: boolean;
  toggle: Function;
  file: string;
  onSubmit: Function;
}

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const ModalPreview: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    open,
    toggle,
    file = "https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg",
    onSubmit,
  } = props;

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={() => toggle()}
      sx={{zIndex: 1059}}
    >
      <Box sx={boxStyle} className="bg-white dark:bg-zinc-800 rounded-lg">
        <div className="p-4 flex justify-between items-center">
          <ArrowLeftIcon className={styles.icon} onClick={() => toggle()} />
          <span className="font-medium">Preview</span>
          <ArrowRightIcon className={styles.icon} onClick={() => onSubmit()} />
        </div>
        <Divider className="dark:bg-zinc-400" />
        <CardMedia
          component="img"
          sx={{height: 400, width: 400}}
          image={file}
        />
      </Box>
    </Modal>
  );
};

export default ModalPreview;
