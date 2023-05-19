import type {NextComponentType, NextPageContext} from "next";
import {useState, useEffect} from "react";

import {HeartIcon} from "@heroicons/react/solid";
import ModalDetailPost from "../components/ModalDetailPost";
import {CardMedia} from "@mui/material";
import * as Alert from "../components/Alert";

import styles from "../styles/Liked.module.css";
import {getCookie} from "cookies-next";
import {getPostsLikedApi} from "../store/api";
import useFetch from "../hooks/useFetch";

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

interface Post {
  id: number;
  files: string[];
  caption: string;
  UserId: number;
  createdAt: string;
  PostComments: PostComment[];
  PostLikes: PostLike[];
}

interface PostLike {
  id: number;
  PostId: number;
  UserId: number;
  Post: Post;
}

interface Props {
  data: {
    data: PostLike[];
  };
  error: null | any;
}

const Liked: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const [refetch, setRefetch] = useState<boolean>(false);
  const [showModalPost, setShowModalPost] = useState<boolean>(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number>(-1);

  const {
    data,
    error,
  }: {
    data:
      | {
          rows: Post[];
        }
      | any;
    loading: boolean;
    error: boolean;
  } = useFetch({
    api: getPostsLikedApi,
    refetch,
    setRefetch,
  });

  const rows = data || [];

  const toggleModalPost = (postIndex: number) => {
    setSelectedPostIndex(postIndex);
    setShowModalPost(!showModalPost);
  };

  useEffect(() => {
    if (error) {
      Alert.Error("Failed fetching data posts!");
    }
  }, [error]);

  return (
    <>
      <ModalDetailPost
        open={showModalPost}
        toggle={toggleModalPost}
        data={rows?.[selectedPostIndex]?.Post || {}}
        setRefetch={setRefetch}
      />
      <div className={`${styles.container} verticalCenter`}>
        <div className={`${styles.postsContainer} verticalCenter`}>
          <div className="horizontalCenter">
            <HeartIcon className="h-6 w-6 text-zinc-900 dark:text-white mr-1" />
            <p>POSTS</p>
          </div>
          <hr className="w-full mt-4 mb-8" />
          {rows && rows.length && Array.isArray(rows) ? (
            <div className="grid grid-cols-3 gap-8 w-full">
              {rows.map((row, idx: number) => (
                <div
                  role="button"
                  onClick={() => toggleModalPost(idx)}
                  key={idx}
                >
                  <CardMedia
                    component="img"
                    className="w-full h-full"
                    image={
                      row?.Post?.files[0] ||
                      "https://pbs.twimg.com/profile_images/1284155869060571136/UpanAYid_400x400.jpg"
                    }
                    sx={{height: 250, width: 250}}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-md">No posts yet</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Liked;
