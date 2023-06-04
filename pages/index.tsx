import type {NextComponentType, NextPageContext} from "next";

import PostCard from "../components/PostCard.";
import * as Alert from "../components/Alert";
import ModalDevelopment from "../components/ModalDevelopment";
import ModalDetailPost from "../components/ModalDetailPost";

import styles from "../styles/Home.module.css";
import {getPosts} from "../store/actions";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useState} from "react";
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

interface PostLike {
  id: number;
  PostId: number;
  UserId: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  name: string;
  bio: string;
  gender: string;
}

interface Post {
  id: number;
  files: string[];
  caption: string;
  UserId: number;
  User: User;
  createdAt: string;
  PostComments: PostComment[];
  PostLikes: PostLike[];
}

interface Posts {
  fetch: boolean;
  data: Post[];
  error: string;
}

interface Props {
  error: null | any;
}

const Home: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const dispatch: any = useDispatch();
  const {
    session: {id, accessToken},
    posts: {data = [], fetch, error},
    refetchPost,
  } = useSelector(
    (state: {
      rootReducer: {
        session: {id: number; accessToken: string};
        refetchPost: boolean;
        posts: Posts;
      };
    }) => state?.rootReducer
  );

  const [showModalDevelopment, setShowModalDevelopment] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number>(-1);

  const toggleModalDevelopment = () =>
    setShowModalDevelopment(!showModalDevelopment);

  const toggleModalDetail = (postIndex: number) => {
    setSelectedPostIndex(postIndex);
    setShowModalDetail(!showModalDetail);
  };

  const fetchPosts = useCallback(
    () => dispatch(getPosts({accessToken})),
    [accessToken, dispatch]
  );

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

  useEffect(() => {
    if (error) {
      Alert.Error("Failed fetching posts!");
    }
  }, [error]);

  useEffect(() => {
    if (accessToken) {
      fetchPosts();
    }
  }, [accessToken, fetchPosts]);

  useEffect(() => {
    if (refetchPost) {
      fetchPosts();
    }
  }, [refetchPost, fetchPosts]);

  return (
    <>
      <ModalDevelopment
        open={showModalDevelopment}
        toggle={toggleModalDevelopment}
        feature="Share"
      />
      <ModalDetailPost
        open={showModalDetail}
        toggle={toggleModalDetail}
        data={data?.[selectedPostIndex] || {}}
        handleLike={handleLike}
        index={selectedPostIndex}
      />
      <div className={`${styles.container} verticalCenter`}>
        {data && data.length && Array.isArray(data) ? (
          <>
            {data.map((row: Post, idx) => (
              <PostCard
                data={row}
                key={idx}
                index={idx}
                ownUserId={id}
                onClickDetail={toggleModalDetail}
                onClickShare={toggleModalDevelopment}
                handleLike={handleLike}
              />
            ))}
          </>
        ) : (
          <p className="text-md">
            {error ? "Failed fetching posts!" : "No posts yet"}
          </p>
        )}
      </div>
    </>
  );
};

export default Home;
