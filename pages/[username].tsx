import {Fragment, useEffect, useMemo, useState, useCallback} from "react";
import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import {connect, useSelector} from "react-redux";
import {
  signOut as signOutProps,
  getProfile as getProfileProps,
  followUnfollow as followUnfollowProps,
  getPosts as getPostsProps,
} from "../store/actions";
import {resetGetProfile as resetGetProfileProps} from "../store/reducers/root";

import {Button, IconButton, Avatar, CardMedia} from "@mui/material";
import {CogIcon, CameraIcon} from "@heroicons/react/outline";

import ModalSettings from "../components/ModalSettings";
import ModalUsers from "../components/ModalUsers";
import ModalDetailPost from "../components/ModalDetailPost";

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
  resetGetProfile: Function;
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
  reload: boolean;
  getPosts: Function;
  getPostsState: {
    fetch: boolean;
    data: {count: number; rows: []};
    error: any;
  };
}

interface Session {
  accessToken: string;
  id: number;
  username: string;
  avatar: string;
}

const Profile: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    signOut,
    getProfile,
    getProfileState,
    resetGetProfile,
    followUnfollow,
    followUnfollowState: {fetch: fetchFollowUnfollow, data: dataFollowUnFollow},
    reload,
    getPosts,
    getPostsState: {
      fetch: fetchGetPosts,
      data: {rows = []},
      error: errorGetPosts,
    },
  } = props;
  const {
    accessToken,
    username: ownUsername,
    id,
  } = useSelector(
    (state: {
      rootReducer: {
        session: Session;
      };
    }) => state?.rootReducer?.session
  ) || {};

  const router = useRouter();
  const {username = ""} = router.query;

  const [showModalSettings, setShowModalSettings] = useState(false);
  const [showModalUsers, setShowModalUsers] = useState(false);
  const [titleModalUsers, setTitleModalUsers] = useState("");
  const [user, setUser] = useState({
    userId: "",
    avatar: "",
    posts: [],
    followers: [],
    following: [],
    bio: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Object>({});
  const [showModalPost, setShowModalPost] = useState(false);

  const toggleModalPost = (post: object) => {
    console.log({post}, "sini");

    setSelectedPost(post);
    setShowModalPost(!showModalPost);
  };

  const isOwnProfile = useMemo(() => {
    if (username === ownUsername) return true;
    return false;
  }, [username, ownUsername]);
  const EllipsisIcon = useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-8 w-8 text-zinc-900 dark:text-white"
      >
        <path
          fillRule="evenodd"
          d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    []
  );

  const getData = useCallback(() => {
    if (accessToken) {
      getPosts({
        accessToken,
        data: username,
      });
    }
  }, [getPosts, username, accessToken]);

  const toggleModalOptions = () => {
    if (isOwnProfile) {
      setShowModalSettings(!showModalSettings);
    }
  };
  const toggleModalUsers = () => {
    setShowModalUsers(!showModalUsers);
  };
  const onClickActionButton = () => {
    if (isOwnProfile) {
      router.push(`/${username}/edit`);
    } else {
      setLoading(true);
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
    resetGetProfile();
  }, [resetGetProfile]);
  useEffect(() => {
    getData();
  }, [getData]);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (username && accessToken) {
      getProfile({
        accessToken,
        data: username,
      });
    }
  }, [username, getProfile]);
  useEffect(() => {
    const {userId, avatar, followers, following, bio, name} =
      getProfileState?.data;
    if (userId) {
      setUser({...user, userId, avatar, followers, following, bio, name});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProfileState]);
  useEffect(() => {
    if (!fetchFollowUnfollow && loading) {
      getProfile({
        accessToken: localStorage.getItem("accessToken"),
        data: username,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFollowUnfollow, loading]);

  useEffect(() => {
    if (reload) {
      window.location.reload();
    }
  }, [reload]);

  return (
    <Fragment>
      <ModalDetailPost
        open={showModalPost}
        toggle={toggleModalPost}
        data={selectedPost}
      />
      <ModalSettings
        open={showModalSettings}
        toggle={toggleModalOptions}
        signOut={handleSignOut}
      />
      <ModalUsers
        open={showModalUsers}
        toggle={toggleModalUsers}
        title={titleModalUsers}
        ownUserId={id}
        loading={loading}
        setLoading={setLoading}
        username={`${username}`}
      />
      <div className={styles.container}>
        <div className="horizontal w-full lg:w-3/5 items-center">
          <Avatar
            className="rounded-full w-20 h-20 mr-8 lg:mr-12 lg:w-44 lg:h-44"
            src={
              user?.avatar ||
              "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
            }
            alt="https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
          />
          <div className="vertical">
            <div className="vertical flex lg:flex-row lg:justify-center lg:items-center w-fit">
              <div className="horizontalCenter">
                <p className="lg:text-2xl text-xl mr-4">{username}</p>
                <div className="lg:hidden">
                  <IconButton
                    aria-label="settings"
                    onClick={toggleModalOptions}
                  >
                    {isOwnProfile ? (
                      <CogIcon className="h-8 w-8 text-zinc-900 dark:text-white" />
                    ) : (
                      <Fragment>{EllipsisIcon}</Fragment>
                    )}
                  </IconButton>
                </div>
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{textTransform: "none"}}
                className={`${styles.btnPrimary} mr-1 ${
                  labelButton === "Following"
                    ? "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 dark:bg-zinc-400 dark:hover:bg-zinc-500"
                    : "bg-primary"
                }`}
                onClick={onClickActionButton}
              >
                {labelButton}
              </Button>
              <IconButton
                aria-label="settings"
                onClick={toggleModalOptions}
                className="hidden lg:flex"
              >
                {isOwnProfile ? (
                  <CogIcon className="h-8 w-8 text-zinc-900 dark:text-white" />
                ) : (
                  <Fragment>{EllipsisIcon}</Fragment>
                )}
              </IconButton>
            </div>
            <div className="my-4 w-fit hidden lg:flex flex-row justify-center items-center">
              <p className="text-lg mr-4">
                <strong>{rows?.length}</strong> posts
              </p>
              <div
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setTitleModalUsers("followers");
                  toggleModalUsers();
                }}
              >
                <p className="text-lg mx-4">
                  <strong>{user?.followers.length}</strong> followers
                </p>
              </div>
              <div
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setTitleModalUsers("following");
                  toggleModalUsers();
                }}
              >
                <p className="text-lg ml-4">
                  <strong>{user?.following.length}</strong> following
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-col">
              <strong className="text-md">{user?.name || "No name yet"}</strong>
              <p className="text-md break-spaces">
                {user?.bio || "No bio yet"}
              </p>
            </div>
          </div>
        </div>
        <div className="vertical lg:hidden mt-4">
          <strong className="lg:text-md text-sm">
            {user?.name || "No name yet"}
          </strong>
          <p className="lg:text-md text-sm break-spaces">
            {user?.bio || "No bio yet"}
          </p>
        </div>
        <hr className="w-full lg:w-3/5 mt-8 lg:hidden" />
        <div className="my-4 horizontal lg:hidden justify-around w-full">
          <div className="text-sm mr-4 flex flex-col items-center">
            <strong>{rows?.length}</strong>
            <span className="">posts</span>
          </div>
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setTitleModalUsers("followers");
              toggleModalUsers();
            }}
          >
            <div className="text-sm mx-4 flex flex-col items-center">
              <strong>{user?.followers.length}</strong>
              <span className="">followers</span>
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setTitleModalUsers("following");
              toggleModalUsers();
            }}
          >
            <div className="text-sm ml-4 flex flex-col items-center">
              <strong>{user?.following.length}</strong>
              <span className="">following</span>
            </div>
          </div>
        </div>
        <hr className="w-full lg:w-3/5 mt-0 lg:mt-8" />
        <div className="horizontalCenter mt-4">
          <CameraIcon className="h-6 w-6 text-zinc-900 dark:text-white mr-1" />
          <p>POSTS</p>
        </div>
        {rows && rows.length && Array.isArray(rows) ? (
          <div className="grid grid-cols-3 lg:gap-8 gap-1 mt-4 w-full lg:w-3/5">
            {rows.map((row: {files: string[]; id: number}, idx: number) => (
              <div
                role="button"
                onClick={() => toggleModalPost({...row, PostId: row?.id})}
                key={idx}
              >
                <CardMedia
                  component="img"
                  image={
                    row?.files[0] ||
                    "https://pbs.twimg.com/profile_images/1284155869060571136/UpanAYid_400x400.jpg"
                  }
                  className="lg:w-64 lg:h-64 w-full h-32"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-md">No posts yet</p>
        )}
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: {
  rootReducer: {
    getProfile: Object;
    followUnfollow: Object;
    reload: boolean;
    getPosts: Object;
  };
}) => ({
  getProfileState: state.rootReducer.getProfile,
  followUnfollowState: state.rootReducer.followUnfollow,
  reload: state.rootReducer.reload,
  getPostsState: state.rootReducer.getPosts,
});
const mapDispatchToProps = {
  signOut: () => signOutProps(),
  getProfile: (payload: {accessToken: string; data: string}) =>
    getProfileProps(payload),
  resetGetProfile: () => resetGetProfileProps(),
  followUnfollow: (payload: {accessToken: string; data: {userId: string}}) =>
    followUnfollowProps(payload),
  getPosts: (payload: {accessToken: string; data: string}) =>
    getPostsProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
