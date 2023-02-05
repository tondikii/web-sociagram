import type {NextComponentType, NextPageContext} from "next";
import {connect} from "react-redux";
import {useState, useCallback, useMemo, Fragment, useEffect} from "react";
import {useRouter} from "next/router";

import {
  getFollowersFollowing as getFollowersFollowingProps,
  followUnfollow as followUnfollowProps,
} from "../store/actions";

import {Modal, Box, Divider, Button} from "@mui/material";
import {XIcon} from "@heroicons/react/outline";
import ReactLoading from "react-loading";

import styles from "../styles/ModalUsers.module.css";

interface Props {
  open: boolean;
  toggle: Function;
  getFollowersFollowing: Function;
  getFollowersFollowingState: {
    fetch: boolean;
    data: [];
    error: any;
  };
  followUnfollow: Function;
  followUnfollowState: {
    fetch: boolean;
    data: {
      userId: string;
    };
    error: string;
  };
  title: string;
  ownUserId: string;
  loading: boolean;
  setLoading: Function;
  username: string;
}

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 432,
  boxShadow: 24,
};

const ModalSearch: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    open,
    toggle,
    getFollowersFollowing,
    getFollowersFollowingState: {fetch, data, error},
    title,
    ownUserId,
    followUnfollow,
    followUnfollowState: {fetch: fetchFollowUnfollow},
    loading,
    setLoading,
    username,
  } = props;
  const router = useRouter();

  const UsersComponent = useMemo(() => {
    const isFollowing = (userIds: string[]) => {
      if (userIds.find((userId) => userId === ownUserId)) {
        return true;
      }
      return false;
    };
    const onClickActionButton = (userId: string) => {
      setLoading(true);
      followUnfollow({
        accessToken: localStorage.getItem("accessToken"),
        data: {userId},
      });
    };
    if (error || data.length < 1) {
      return (
        <div className="flex flex-col items-center my-4">
          <span
            className={`${
              error ? "text-red-600" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {error || "No followers found"}
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col overflow-y-scroll max-h-96">
        {data.map(
          (
            e: {
              userId: string;
              avatar: string;
              username: string;
              name: string;
              followers: string[];
            },
            idx
          ) => (
            <div
              className={`${styles.userCard} ${
                idx === data?.length - 1 ? "remove-mb" : ""
              }`}
              key={idx}
            >
              <img
                className="rounded-full w-12 h-12 cursor-pointer"
                src={
                  e?.avatar ||
                  "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
                }
                alt="https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
                onClick={(event) => {
                  event.preventDefault();
                  toggle();
                  router.push(`/${e?.username}`);
                }}
              />
              <div
                className="flex flex-col ml-4 cursor-pointer"
                onClick={(event) => {
                  event.preventDefault();
                  toggle();
                  router.push(`/${e?.username}`);
                }}
              >
                <span className="font-medium">{e?.username || "-"}</span>
                <span className="text-zinc-400">{e?.name || "-"}</span>
              </div>
              {ownUserId !== e?.userId ? (
                <Button
                  fullWidth
                  variant="contained"
                  style={{textTransform: "none"}}
                  className={`${styles.btnFollow} ${
                    isFollowing(e?.followers || [])
                      ? "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 dark:bg-zinc-400 dark:hover:bg-zinc-500"
                      : "bg-primary"
                  }`}
                  disabled={loading}
                  onClick={() => onClickActionButton(e?.userId)}
                >
                  {isFollowing(e?.followers || []) ? "Following" : "Follow"}
                </Button>
              ) : null}
            </div>
          )
        )}
      </div>
    );
  }, [data, error, router, toggle, ownUserId, loading]);

  useEffect(() => {
    getFollowersFollowing({
      accessToken: localStorage.getItem("accessToken"),
      menu: title,
      username,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFollowersFollowing, title, open]);

  useEffect(() => {
    if (!fetchFollowUnfollow && loading) {
      getFollowersFollowing({
        accessToken: localStorage.getItem("accessToken"),
        menu: title,
        username,
      });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFollowUnfollow, loading]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={() => toggle()}
    >
      <Box sx={boxStyle} className="bg-white dark:bg-zinc-800 rounded-lg">
        <div className="p-4 flex justify-center">
          <span className="text-xl font-medium">{title}</span>
          <XIcon
            className={styles.iconClose}
            onClick={() => {
              toggle();
            }}
          />
        </div>

        <Divider className="dark:bg-zinc-400" />
        <div className="p-4 items-center">
          {fetch && !data?.length ? (
            <Fragment>
              {fetch ? (
                <div className="flex flex-col items-center my-4">
                  <ReactLoading
                    type="bars"
                    color={"#9c27b0"}
                    height={42}
                    width={42}
                  />
                </div>
              ) : null}
            </Fragment>
          ) : (
            <Fragment>{UsersComponent}</Fragment>
          )}
        </div>
      </Box>
    </Modal>
  );
};

const mapStateToProps = (state: {
  rootReducer: {getFollowersFollowing: Object; followUnfollow: Object};
}) => ({
  getFollowersFollowingState: state.rootReducer.getFollowersFollowing,
  followUnfollowState: state.rootReducer.followUnfollow,
});
const mapDispatchToProps = {
  getFollowersFollowing: (payload: {accessToken: string; menu: string}) =>
    getFollowersFollowingProps(payload),
  followUnfollow: (payload: {accessToken: string; data: {userId: string}}) =>
    followUnfollowProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalSearch);
