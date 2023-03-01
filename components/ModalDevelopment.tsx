import type {NextComponentType, NextPageContext} from "next";

import {XIcon} from "@heroicons/react/outline";
import {Modal, Box, CardMedia} from "@mui/material";

import styles from "../styles/ModalDevelopment.module.css";

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "24rem",
  boxShadow: 24,
};

interface Props {
  open: boolean;
  toggle: Function;
  feature: string;
}

const ModalDevelopment: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {open, toggle, feature} = props;

  return (
    <Modal
      open={open}
      onClose={() => toggle()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxStyle} className="bg-white dark:bg-zinc-800 rounded-lg p-4">
        <XIcon
          className={styles.iconClose}
          onClick={() => {
            toggle();
          }}
        />
        <div className="flex flex-col justify-center items-center p-4">
          <CardMedia
            component="img"
            className="w-80"
            image={"/restrict-development.svg"}
          />
          <span>{feature || "The"} feature is under development</span>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalDevelopment;
