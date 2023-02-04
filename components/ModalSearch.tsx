import type {NextComponentType, NextPageContext} from "next";
import {Modal, Box, Typography, Divider} from "@mui/material";
import {SearchIcon, XIcon} from "@heroicons/react/outline";

import styles from "../styles/ModalSearch.module.css";

interface Props {
  open: boolean;
  toggle: Function;
}

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  boxShadow: 24,
};

const ModalSearch: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {open, toggle} = props;

  return (
    <Modal
      open={open}
      // onClose={() => toggle()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxStyle} className="bg-white dark:bg-zinc-800 rounded-lg">
        <div className="p-4 flex justify-between items-center">
          <p className="text-2xl font-medium">Search</p>
          <XIcon className="w-6 h-6 cursor-pointer" onClick={() => toggle()} />
        </div>

        <Divider />
        <div className="p-4">
          <div className={styles.iconContainer}>
            <SearchIcon className={styles.icon} />
          </div>
          <input
            name="user"
            type="text"
            placeholder="Type username..."
            className={`${styles.input}`}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default ModalSearch;
