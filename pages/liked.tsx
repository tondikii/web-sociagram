import type {NextComponentType, NextPageContext} from "next";
import {connect} from "react-redux";
import {useState, useEffect, useCallback} from "react";

import {getPostsLiked as getPostsLikedProps} from "../store/actions";

import {HeartIcon} from "@heroicons/react/solid";
import ModalDetailPost from "../components/ModalDetailPost";
import {CardMedia} from "@mui/material";

import styles from "../styles/Liked.module.css";

interface Props {
  getPosts: Function;
  getPostsState: {
    fetch: boolean;
    data: [];
    error: any;
  };
}

const Liked: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const {
    getPosts,
    getPostsState: {fetch, data = [], error},
  } = props;

  const [selectedPost, setSelectedPost] = useState({});
  const [showModalPost, setShowModalPost] = useState(false);

  const toggleModalPost = (post: object) => {
    setSelectedPost(post);
    setShowModalPost(!showModalPost);
  };

  useEffect(() => {
    getPosts({
      accessToken: localStorage.getItem("accessToken"),
    });
  }, [getPosts]);

  return (
    <>
      <ModalDetailPost
        open={showModalPost}
        toggle={toggleModalPost}
        data={selectedPost}
      />
      <div className={`${styles.container} verticalCenter`}>
        <div className={`${styles.postsContainer} verticalCenter`}>
          <div className="horizontalCenter">
            <HeartIcon className="h-6 w-6 text-zinc-900 dark:text-white mr-1" />
            <p>POSTS</p>
          </div>
          <hr className="w-full mt-4 mb-8" />
          {data && data.length && Array.isArray(data) ? (
            <div className="grid grid-cols-3 gap-8 w-full">
              {data.map((row: {files: string[]}, idx: number) => (
                <div
                  role="button"
                  onClick={() => toggleModalPost(row)}
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

const mapStateToProps = (state: {
  rootReducer: {
    getPostsLiked: Object;
  };
}) => ({
  getPostsState: state.rootReducer.getPostsLiked,
});

const mapDispatchToProps = {
  getPosts: (payload: {accessToken: string; data: string}) =>
    getPostsLikedProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(Liked);
