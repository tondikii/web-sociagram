import {Fragment, useState} from "react";
import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import {connect} from "react-redux";
import {signOut as signOutProps} from "../store/actions";

import {Button, IconButton} from "@mui/material";
import {CogIcon, CameraIcon} from "@heroicons/react/outline";

import ModalSettings from "../components/ModalSettings";

import styles from "../styles/Profile.module.css";

interface Props {
  signOut: Function;
}

const Profile: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {signOut} = props;

  const router = useRouter();

  const [showModalSettings, setShowModalSettings] = useState(false);

  const toggleModalSettings = () => {
    setShowModalSettings(!showModalSettings);
  };
  const onClickEditProfile = () => {
    router.push("/profile/edit");
  };
  const handleSignOut = () => {
    signOut();
    router.push("/signin");
  };

  return (
    <Fragment>
      <ModalSettings
        open={showModalSettings}
        toggle={toggleModalSettings}
        signOut={handleSignOut}
      />
      <div className={`${styles.container} verticalCenter`}>
        <div className="horizontal p-4 w-3/5">
          <img
            className="rounded-full w-44 h-44 mr-12"
            src="https://pbs.twimg.com/profile_images/1284155869060571136/UpanAYid_400x400.jpg"
            alt="https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
          />
          <div className="vertical">
            <div className="horizontalCenter w-fit">
              <p className="text-2xl">tondikii</p>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{textTransform: "none"}}
                className={`${styles.btnPrimary}`}
                onClick={onClickEditProfile}
              >
                Edit profile
              </Button>
              <IconButton aria-label="settings" onClick={toggleModalSettings}>
                <CogIcon className="h-8 w-8 text-zinc-900 dark:text-white" />
              </IconButton>
            </div>
            <div className="horizontalCenter my-4 w-fit">
              <p className="text-lg mr-4">
                <strong>{"8"}</strong> posts
              </p>
              <p className="text-lg mx-4">
                <strong>{"497"}</strong> followers
              </p>
              <p className="text-lg ml-4">
                <strong>{"431"}</strong> following
              </p>
            </div>
            <div className="vertical">
              <strong className="text-md">{"Tondiki Andika"}</strong>
              <p className="text-md">
                {
                  "Tayang besok, beli tiket @filmhidayah pake website atau aplikasi CGV buat dapetin promo BUY 1 GET 1. Kuota terbatas, beli tiketnya sekarang! Jangan lupa masukin kode promo: HIDAYAH ya :)"
                }
              </p>
            </div>
          </div>
        </div>
        <hr className="w-3/5 mt-8" />
        <div className="horizontalCenter mt-4">
          <CameraIcon className="h-6 w-6 text-zinc-900 dark:text-white mr-1" />
          <p>POSTS</p>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-4 w-3/5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((el) => (
            <div className="" key={el}>
              <img
                className="w-full h-full"
                src="https://pbs.twimg.com/profile_images/1284155869060571136/UpanAYid_400x400.jpg"
                alt="https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
              />
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: {rootReducer: {signIn: Object}}) => ({});
const mapDispatchToProps = {
  signOut: () => signOutProps(),
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
