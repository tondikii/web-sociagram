import type {NextComponentType, NextPageContext} from "next";
import {useState, useEffect, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";

import {HeartIcon} from "@heroicons/react/solid";
import ModalDetailPost from "../components/ModalDetailPost";
import {CardMedia} from "@mui/material";
import * as Alert from "../components/Alert";

import styles from "../styles/Liked.module.css";
import {getPostsLikedApi} from "../store/api";
import useFetch from "../hooks/useFetch";
import {getPostsLiked} from "../store/actions";
import {setPosts} from "../store/reducers/root";

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

interface Posts {
  fetch: boolean;
  data: Post[];
  error: string;
}

interface Props {}

const Liked: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const [refetch, setRefetch] = useState<boolean>(false);
  const [showModalPost, setShowModalPost] = useState<boolean>(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number>(-1);

  const dispatch: any = useDispatch();
  const {
    session: {id, accessToken},
    posts: {data = [], fetch, error},
  } = useSelector(
    (state: {
      rootReducer: {
        session: {id: number; accessToken: string};
        refetchPost: boolean;
        posts: Posts;
      };
    }) => state?.rootReducer
  );

  const rows = data || [];

  const toggleModalPost = (postIndex: number) => {
    setSelectedPostIndex(postIndex);
    setShowModalPost(!showModalPost);
  };

  const handleLike = (idx: number, dataLike: PostLike) => {
    const newRows = [...data];
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

  const fetchPosts = useCallback(
    () => dispatch(getPostsLiked({accessToken})),
    [accessToken, dispatch]
  );

  useEffect(() => {
    if (accessToken) {
      fetchPosts();
    }
  }, [accessToken, fetchPosts]);

  useEffect(() => {
    if (error) {
      Alert.Error("Failed fetching posts!");
    }
  }, [error]);

  return (
    <>
      <ModalDetailPost
        open={showModalPost}
        toggle={toggleModalPost}
        data={rows?.[selectedPostIndex] || {}}
        handleLike={handleLike}
        index={selectedPostIndex}
      />
      <div className={`${styles.container} verticalCenter`}>
        <div className={`${styles.postsContainer} verticalCenter`}>
          <div className="horizontalCenter">
            <HeartIcon className="h-6 w-6 text-zinc-900 dark:text-white mr-1" />
            <p>POSTS</p>
          </div>
          <hr className="w-full mt-4 mb-8" />
          {rows && rows.length && Array.isArray(rows) ? (
            <div className="grid grid-cols-3 lg:gap-8 w-full">
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
                      row?.files[0] ||
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
