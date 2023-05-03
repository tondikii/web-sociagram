import type {
  GetServerSidePropsContext,
  NextComponentType,
  NextPageContext,
} from "next";

import PostCard from "../components/PostCard.";

import styles from "../styles/Home.module.css";
import {getPostsApi} from "../store/api";
import {getCookie} from "cookies-next";

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

interface Props {
  data:
    | {
        data: {
          rows: Post[];
        };
      }
    | any;
  error: null | any;
}

const Home: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const {data, error} = props;

  const {rows = []} = data?.data || {};

  return (
    <div className={`${styles.container} verticalCenter`}>
      {rows && rows.length && Array.isArray(rows) ? (
        <>
          {rows.map((row, idx) => (
            <PostCard data={row} key={idx} />
          ))}
        </>
      ) : (
        <p className="text-md">No posts yet</p>
      )}
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const {req, res} = context;
    const accessToken: string | any =
      getCookie("accessToken", {req, res}) || "";
    const {data} = await getPostsApi({accessToken});
    return {
      props: {data: data},
    };
  } catch (error) {
    return {
      props: {data: {error, data: null}},
    };
  }
};

export default Home;
