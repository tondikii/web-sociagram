import type {NextComponentType, NextPageContext} from "next";
import {Modal, Box, List, ListItem, ListItemText, Divider} from "@mui/material";
import {Fragment} from "react";

interface Props {
  open: boolean;
  toggle: Function;
  signOut: Function;
}

const ModalSettings: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {open, toggle, signOut} = props;

  const menus = [
    {label: "Sign Out", onClick: signOut},
    {label: "Cancel", onClick: toggle},
  ];

  return (
    <Modal
      open={open}
      onClose={() => toggle()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          boxShadow: 24,
        }}
        className="bg-white dark:bg-zinc-800 rounded-lg"
      >
        <List
          sx={{
            width: "100%",
          }}
          component="nav"
          aria-label="mailbox folders"
        >
          {menus.map((menu, idx) => (
            <Fragment key={idx}>
              <ListItem onClick={() => menu.onClick()} role="button">
                <ListItemText primary={menu.label} />
              </ListItem>
              {idx !== menus.length - 1 && <Divider />}
            </Fragment>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default ModalSettings;
