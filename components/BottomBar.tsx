import {Fragment, useEffect, useState} from "react";
import {BottomNavigation, BottomNavigationAction, Avatar} from "@mui/material";
import {
  Home as HomeIcon,
  HomeOutlined as HomeOutlinedIcon,
  Add as AddIcon,
  QuestionAnswerOutlined as QuestionAnswerOutlinedIcon,
} from "@mui/icons-material";
import {NextComponentType, NextPageContext} from "next";
import styles from "../styles/BottomBar.module.css";
import {useRouter} from "next/router";
import ModalDevelopment from "./ModalDevelopment";
import ModalCreate from "./ModalCreate";

interface Props {}

const BottomBar: NextComponentType<NextPageContext, {}, Props> = () => {
  const router = useRouter();

  const [value, setValue] = useState(0);
  const [user, setUser] = useState({username: "", avatar: ""});
  const [showModalDevelopment, setShowModalDevelopment] = useState(false);
  const [showModalCreate, setShowModalCreate] = useState(false);

  const toggleModalCreate = () => {
    setShowModalCreate(!showModalCreate);
  };
  const toggleModalDevelopment = () =>
    setShowModalDevelopment(!showModalDevelopment);

  useEffect(() => {
    setUser({
      username: localStorage.getItem("username") || "",
      avatar: localStorage.getItem("avatar") || "",
    });
  }, []);

  return (
    <Fragment>
      <ModalDevelopment
        open={showModalDevelopment}
        toggle={toggleModalDevelopment}
        feature="Chat"
      />
      <ModalCreate
        toggle={toggleModalCreate}
        open={showModalCreate}
        username={user.username}
        avatar={user.avatar}
      />
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{width: "100vw", zIndex: 2000}}
        className={styles.container}
      >
        <BottomNavigationAction
          icon={
            router?.pathname === "/" ? (
              <HomeIcon className={styles.selectedIcon} />
            ) : (
              <HomeOutlinedIcon className={styles.icon} />
            )
          }
          onClick={() => router.push("/")}
        />
        <BottomNavigationAction
          onClick={toggleModalCreate}
          icon={<AddIcon className={styles.icon} />}
        />
        <BottomNavigationAction
          icon={<QuestionAnswerOutlinedIcon className={styles.icon} />}
          onClick={toggleModalDevelopment}
        />
        <BottomNavigationAction
          icon={
            <Avatar
              className={
                router?.query?.username === user?.username
                  ? styles.selectedIconImage
                  : styles.iconImage
              }
              src={
                user?.avatar ||
                "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
              }
              alt="https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
            />
          }
          onClick={() => router.push(`/${user?.username}`)}
        />
      </BottomNavigation>
    </Fragment>
  );
};

export default BottomBar;
