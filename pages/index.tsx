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
  dataPosts:
    | {
        data: {
          rows: Post[];
        };
      }
    | any;
}

const Home: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const {dataPosts} = props;

  const {rows = []} = dataPosts?.data || {};

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
      props: {dataPosts: data},
    };
  } catch (error) {
    return {
      props: {dataPosts: {error, data: null}},
    };
  }
};

export default Home;
