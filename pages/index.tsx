import type {
  // GetServerSidePropsContext,
  NextComponentType,
  NextPageContext,
} from "next";

import PostCard from "../components/PostCard.";
import * as Alert from "../components/Alert";

import styles from "../styles/Home.module.css";
import {getPostsApi} from "../store/api";
// import {getCookie} from "cookies-next";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
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
  // data:
  //   | {
  //       data: {
  //         rows: Post[];
  //       };
  //     }
  //   | any;
  error: null | any;
}

const Home: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const [refetch, setRefetch] = useState<boolean>(false);
  const {
    data,
    // loading,
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

  console.log({data});

  const {rows = []} = data || {};

  const id = useSelector(
    (state: {
      rootReducer: {
        session: {id: number};
      };
    }) => state?.rootReducer?.session?.id
  );

  useEffect(() => {
    if (error) {
      Alert.Error("Failed fetching data posts!");
    }
  }, [error]);

  return (
    <div className={`${styles.container} verticalCenter`}>
      {rows && rows.length && Array.isArray(rows) ? (
        <>
          {rows.map((row: Post, idx) => (
            <PostCard data={row} key={idx} ownUserId={id} />
          ))}
        </>
      ) : (
        <p className="text-md">No posts yet</p>
      )}
    </div>
  );
};

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   try {
//     const {req, res} = context;
//     const accessToken: string | any =
//       getCookie("accessToken", {req, res}) || "";
//     const {data} = await getPostsApi({accessToken});
//     return {
//       props: {data: data},
//     };
//   } catch (error) {
//     return {
//       props: {data: {error, data: null}},
//     };
//   }
// };

export default Home;
