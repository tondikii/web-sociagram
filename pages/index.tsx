import type {NextComponentType, NextPageContext} from "next";
import {connect} from "react-redux";

import {getPosts as getPostsProps} from "../store/actions";

import PostCard from "../components/PostCard.";

import styles from "../styles/Home.module.css";
import {useEffect, useCallback} from "react";

interface Props {
  getPosts: Function;
  getPostsState: {
    fetch: boolean;
    data: {count: number; rows: []};
    error: any;
  };
}

const Home: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const {
    getPosts,
    getPostsState: {
      fetch,
      data: {rows = []},
      error,
    },
  } = props;

  const getData = useCallback(
    (username: string) => {
      getPosts({
        accessToken: localStorage.getItem("accessToken"),
        data: username,
      });
    },
    [getPosts]
  );

  useEffect(() => {
    getData("");
  }, [getData]);

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

const mapStateToProps = (state: {rootReducer: {getPosts: Object}}) => ({
  getPostsState: state.rootReducer.getPosts,
});
const mapDispatchToProps = {
  getPosts: (payload: {accessToken: string; data: string}) =>
    getPostsProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
