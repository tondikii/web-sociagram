import type {NextComponentType, NextPageContext} from "next";

import PostCard from "../components/PostCard.";
import * as Alert from "../components/Alert";
import ModalDevelopment from "../components/ModalDevelopment";
import ModalDetailPost from "../components/ModalDetailPost";

import styles from "../styles/Home.module.css";
import {getPostsApi} from "../store/api";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import useFetch from "../hooks/useFetch";
import {setRefetchPost} from "../store/reducers/root";

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

interface Props {
  error: null | any;
}

const Home: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const dispatch = useDispatch();
  const [refetch, setRefetch] = useState<boolean>(false);
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
    api: getPostsApi,
    refetch,
    setRefetch,
  });

  const {rows = []} = data || {};

  const {
    refetchPost,
    session: {id},
  } = useSelector(
    (state: {
      rootReducer: {
        session: {id: number};
        refetchPost: boolean;
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
  useEffect(() => {
    if (error) {
      Alert.Error("Failed fetching data posts!");
    }
  }, [error]);
  useEffect(() => {
    if (refetchPost) {
      setRefetch(true);
      dispatch(setRefetchPost(false));
    }
  }, [refetchPost, dispatch]);

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
        data={rows?.[selectedPostIndex] || {}}
        setRefetch={setRefetch}
      />
      <div className={`${styles.container} verticalCenter`}>
        {rows && rows.length && Array.isArray(rows) ? (
          <>
            {rows.map((row: Post, idx) => (
              <PostCard
                data={row}
                key={idx}
                index={idx}
                ownUserId={id}
                setRefetch={setRefetch}
                onClickDetail={toggleModalDetail}
                onClickShare={toggleModalDevelopment}
              />
            ))}
          </>
        ) : (
          <p className="text-md">No posts yet</p>
        )}
      </div>
    </>
  );
};

export default Home;
