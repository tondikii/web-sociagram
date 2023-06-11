import {Fragment, useEffect, useMemo, useState, useCallback} from "react";
import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {followUnfollowApi, getProfileApi} from "../store/api";

import {Button, IconButton, Avatar, CardMedia} from "@mui/material";
import {CogIcon, CameraIcon} from "@heroicons/react/outline";
import {signOut as signOutProps} from "../store/actions";

import * as Alert from "../components/Alert";
import ModalSettings from "../components/ModalSettings";
import ModalUsers from "../components/ModalUsers";
import ModalDetailPost from "../components/ModalDetailPost";

import styles from "../styles/Profile.module.css";
import useFetch from "../hooks/useFetch";
import {setRefetchPost, setPosts} from "../store/reducers/root";

interface PostCommentUser {
  id: number;
  username: string;
  avatar: string;
}

interface PostComment {
  id: number;
  comment: string;
  User: PostCommentUser;
}

interface PostLike {
  id: number;
  PostId: number;
  UserId: number;
}

interface Post {
  id: number;
  files: string[];
  caption: string;
  UserId: number;
  createdAt: string;
  PostComments: PostComment[];
  PostLikes: PostLike[];
}

interface Profile {
  id: number;
  username: string;
  email: string;
  avatar: string;
  name: string;
  bio: string;
  gender: string;
  followers: number[];
  following: number[];
  Posts: Post[];
}

interface Props {}

interface Session {
  accessToken: string;
  id: number;
  username: string;
  avatar: string;
}

interface Posts {
  fetch: boolean;
  data: Post[];
  error: string;
}

const Profile: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {} = props;

  const dispatch = useDispatch();
  const signOut: Function = signOutProps;

  const {
    session: {accessToken, username: ownUsername, id},
    refetchPost,
    posts: {data: rows = [], fetch, error},
  } = useSelector(
    (state: {
      rootReducer: {
        session: Session;
        refetchPost: boolean;
        posts: Posts;
      };
    }) => state?.rootReducer
  ) || {};

  const router = useRouter();
  const {username = ""} = router.query;

  const [showModalSettings, setShowModalSettings] = useState(false);
  const [showModalUsers, setShowModalUsers] = useState(false);
  const [titleModalUsers, setTitleModalUsers] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number>(-1);
  const [showModalPost, setShowModalPost] = useState<boolean>(false);

  const [refetch, setRefetch] = useState<boolean>(false);
  const {
    data,
  }: {
    data: Profile | any;
  } = useFetch({
    api: getProfileApi,
    refetch,
    setRefetch,
    payload: {data: username},
  });

  useEffect(() => {
    if (data?.Posts) {
      dispatch(setPosts(data?.Posts));
    }
  }, [data, dispatch]);

  const toggleModalPost = useCallback(
    (postIndex: number) => {
      setSelectedPostIndex(postIndex);
      setShowModalPost(!showModalPost);
    },
    [showModalPost]
  );

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

  const toggleModalOptions = () => {
    if (isOwnProfile) {
      setShowModalSettings(!showModalSettings);
    }
  };
  const toggleModalUsers = useCallback(() => {
    setShowModalUsers(!showModalUsers);
  }, [showModalUsers]);

  const onClickActionButton = async () => {
    try {
      if (isOwnProfile) {
        router.push(`/${username}/edit`);
      } else {
        if (loading) return;
        setLoading(true);
        await followUnfollowApi({
          accessToken,
          data: {id: data?.id},
        });
        setRefetch(true);
      }
    } catch (err) {
      if (!isOwnProfile) {
        Alert.Error("Failed do action");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
    router.push("/signin");
  };

  const labelButton = useMemo(() => {
    if (loading) {
      return "Loading...";
    }
    if (isOwnProfile) {
      return "Edit profile";
    }
    const followers = data?.followers || [];
    if (followers.length) {
      if (followers.find((eId: number) => eId === id)) {
        return "Following";
      }
      return "Follow";
    }
    return "Follow";
  }, [isOwnProfile, data?.followers, id, loading]);

  const ComponentModalUsers = useMemo(
    () => (
      <ModalUsers
        open={showModalUsers}
        toggle={toggleModalUsers}
        title={titleModalUsers}
        ownUserId={id}
        targetUserId={data?.id}
        accessToken={accessToken}
        setRefetch={setRefetch}
      />
    ),
    [
      accessToken,
      data?.id,
      id,
      showModalUsers,
      titleModalUsers,
      toggleModalUsers,
    ]
  );

  const ComponentModalDetailPost = useMemo(() => {
    const handleLike = (idx: number, dataLike: PostLike) => {
      const newRows = [...rows];
      const row = newRows[idx];
      const isFound = row?.PostLikes.find(({id}) => id === dataLike?.id);
      if (isFound) {
        newRows[idx] = {
          ...row,
          PostLikes: [...row?.PostLikes.filter(({id}) => id !== dataLike?.id)],
        };
        dispatch(setPosts(newRows));
      } else {
        newRows[idx] = {
          ...row,
          PostLikes: [...row?.PostLikes, dataLike],
        };
        dispatch(setPosts(newRows));
      }
    };

    return (
      <ModalDetailPost
        open={showModalPost}
        toggle={toggleModalPost}
        data={
          {
            ...rows?.[selectedPostIndex],
            User: {username, avatar: data?.avatar},
          } || {}
        }
        index={selectedPostIndex}
        handleLike={handleLike}
      />
    );
  }, [
    showModalPost,
    toggleModalPost,
    selectedPostIndex,
    rows,
    data?.avatar,
    username,
    dispatch,
  ]);

  useEffect(() => {
    if (username) {
      setRefetch(true);
    }
  }, [username]);
  useEffect(() => {
    if (refetchPost) {
      setRefetch(true);
      dispatch(setRefetchPost(false));
    }
  }, [refetchPost, dispatch]);

  return (
    <Fragment>
      <ModalSettings
        open={showModalSettings}
        toggle={toggleModalOptions}
        signOut={handleSignOut}
      />
      {ComponentModalDetailPost}
      {ComponentModalUsers}
      <div className={styles.container}>
        <div className="horizontal w-full lg:w-3/5 items-center">
          <Avatar
            className="rounded-full w-20 h-20 mr-8 lg:mr-12 lg:w-44 lg:h-44"
            src={
              data?.avatar ||
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
                disabled={loading}
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
                  <strong>{data?.followers.length}</strong> followers
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
                  <strong>{data?.following.length}</strong> following
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-col">
              <strong className="text-md">{data?.name || "No name yet"}</strong>
              <p className="text-md break-spaces">
                {data?.bio || "No bio yet"}
              </p>
            </div>
          </div>
        </div>
        <div className="vertical lg:hidden mt-6 w-full items-start ">
          <strong className="lg:text-md text-sm">
            {data?.name || "No name yet"}
          </strong>
          <p className="lg:text-md text-sm break-spaces">
            {data?.bio || "No bio yet"}
          </p>
        </div>
        <hr className="w-full lg:w-3/5 mt-6 lg:hidden" />
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
              <strong>{data?.followers.length}</strong>
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
              <strong>{data?.following.length}</strong>
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
              <div role="button" onClick={() => toggleModalPost(idx)} key={idx}>
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

export default Profile;
