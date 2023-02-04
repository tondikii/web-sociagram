import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import {connect} from "react-redux";
import {
  signOut as signOutProps,
  getProfile as getProfileProps,
  followUnfollow as followUnfollowProps,
} from "../store/actions";

import {Button, IconButton} from "@mui/material";
import {CogIcon, CameraIcon} from "@heroicons/react/outline";

import ModalSettings from "../components/ModalSettings";

import styles from "../styles/Profile.module.css";

interface Props {
  signOut: Function;
  getProfile: Function;
  getProfileState: {
    fetch: boolean;
    data: {
      userId: string;
      avatar: string;
      followers: never[];
      following: never[];
      bio: string;
      name: string;
    };
    error: string;
  };
  followUnfollow: Function;
  followUnfollowState: {
    fetch: boolean;
    data: {
      userId: string;
      avatar: string;
      followers: never[];
      following: never[];
      bio: string;
      name: string;
    };
    error: string;
  };
}

const Profile: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    signOut,
    getProfile,
    getProfileState,
    followUnfollow,
    followUnfollowState: {data: dataFollowUnFollow},
  } = props;

  const router = useRouter();
  const {username} = router.query;

  const [showModalSettings, setShowModalSettings] = useState(false);
  const [user, setUser] = useState({
    userId: "",
    avatar: "",
    posts: [],
    followers: [],
    following: [],
    bio: "",
    name: "",
  });
  const [cookieUsername, setCookieUsername] = useState("");

  const isOwnProfile = useMemo(() => {
    if (username === cookieUsername) return true;
    return false;
  }, [username, cookieUsername]);
  const EllipsisIcon = useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-8 w-8 text-zinc-900 dark:text-white"
      >
        <path
          fill-rule="evenodd"
          d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    []
  );

  const toggleModalOptions = () => {
    if (isOwnProfile) {
      setShowModalSettings(!showModalSettings);
    }
  };
  const onClickActionButton = () => {
    if (isOwnProfile) {
      router.push(`/${username}/edit`);
    } else {
      followUnfollow({
        accessToken: localStorage.getItem("accessToken"),
        data: {userId: user?.userId},
      });
    }
  };
  const handleSignOut = () => {
    signOut();
    router.push("/signin");
  };
  const labelButton = useMemo(() => {
    if (isOwnProfile) {
      return "Edit profile";
    }
    const followers = user?.followers || [];
    if (followers.length) {
      if (followers.find((id) => id === localStorage.getItem("userId"))) {
        return "Following";
      }
      return "Follow";
    }
    return "Follow";
  }, [isOwnProfile, user?.followers]);

  useEffect(() => {
    setCookieUsername(localStorage.getItem("username") || "");
  }, []);
  useEffect(() => {
    if (username) {
      getProfile({
        accessToken: localStorage.getItem("accessToken"),
        data: username,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);
  useEffect(() => {
    const {userId, avatar, followers, following, bio, name} =
      getProfileState?.data;
    if (userId) {
      setUser({...user, userId, avatar, followers, following, bio, name});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProfileState]);
  useEffect(() => {
    const {userId, avatar, followers, following, bio, name} =
      dataFollowUnFollow;
    if (userId) {
      setUser({...user, userId, avatar, followers, following, bio, name});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFollowUnFollow]);

  return (
    <Fragment>
      <ModalSettings
        open={showModalSettings}
        toggle={toggleModalOptions}
        signOut={handleSignOut}
      />
      <div className={`${styles.container} verticalCenter`}>
        <div className="horizontal p-4 w-3/5">
          <img
            className="rounded-full w-44 h-44 mr-12"
            src={
              user?.avatar ||
              "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
            }
            alt="https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
          />
          <div className="vertical">
            <div className="horizontalCenter w-fit">
              <p className="text-2xl">{username}</p>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{textTransform: "none"}}
                className={`${styles.btnPrimary} ${
                  labelButton === "Following"
                    ? "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 dark:bg-zinc-400 dark:hover:bg-zinc-500"
                    : "bg-primary"
                }`}
                onClick={onClickActionButton}
              >
                {labelButton}
              </Button>
              <IconButton aria-label="settings" onClick={toggleModalOptions}>
                {isOwnProfile ? (
                  <CogIcon className="h-8 w-8 text-zinc-900 dark:text-white" />
                ) : (
                  <Fragment>{EllipsisIcon}</Fragment>
                )}
              </IconButton>
            </div>
            <div className="horizontalCenter my-4 w-fit">
              <p className="text-lg mr-4">
                <strong>{user?.posts.length}</strong> posts
              </p>
              <p className="text-lg mx-4">
                <strong>{user?.followers.length}</strong> followers
              </p>
              <p className="text-lg ml-4">
                <strong>{user?.following.length}</strong> following
              </p>
            </div>
            <div className="vertical">
              <strong className="text-md">{user?.name || "No name yet"}</strong>
              <p className="text-md">{user?.bio || "No bio yet"}</p>
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

const mapStateToProps = (state: {
  rootReducer: {getProfile: Object; followUnfollow: Object};
}) => ({
  getProfileState: state.rootReducer.getProfile,
  followUnfollowState: state.rootReducer.followUnfollow,
});
const mapDispatchToProps = {
  signOut: () => signOutProps(),
  getProfile: (payload: {accessToken: string; data: string}) =>
    getProfileProps(payload),
  followUnfollow: (payload: {accessToken: string; data: {userId: string}}) =>
    followUnfollowProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
