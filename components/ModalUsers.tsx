import type {NextComponentType, NextPageContext} from "next";
import {useState, useMemo, Fragment, useEffect} from "react";
import {useRouter} from "next/router";

import {followUnfollowApi, getFollowersFollowingApi} from "../store/api";

import {Modal, Box, Divider, Button, Avatar} from "@mui/material";
import {XIcon} from "@heroicons/react/outline";
import ReactLoading from "react-loading";
import * as Alert from "../components/Alert";

import styles from "../styles/ModalUsers.module.css";
import useFetch from "../hooks/useFetch";

interface Props {
  open: boolean;
  toggle: Function;
  title: string;
  ownUserId: number;
  targetUserId: number;
  accessToken: string;
  setRefetch: Function;
}

interface Profile {
  id: number;
  avatar: string;
  username: string;
  name: string;
  followers: number[];
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
    title,
    ownUserId,
    accessToken,
    targetUserId,
    setRefetch: setRefetchProfile,
  } = props;

  const router = useRouter();

  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const {
    data,
    loading,
    error,
  }: {data: Profile[] | any; loading: boolean; error: boolean} = useFetch({
    api: getFollowersFollowingApi,
    payload: {
      menu: title,
      id: targetUserId,
    },
    prevent: !open,
    refetch,
    setRefetch,
  });

  const UsersComponent = useMemo(() => {
    const isFollowing = (ids: number[]) => {
      if (ids.find((eId) => eId === ownUserId)) {
        return true;
      }
      return false;
    };
    const onClickActionButton = async (id: number) => {
      try {
        if (loadingAction) return;
        setLoadingAction(true);
        await followUnfollowApi({
          accessToken,
          data: {id},
        });
        setLoadingAction(false);
        setRefetchProfile(true);
        setRefetch(true);
      } catch (err) {
        Alert.Error("Failed do action");
      } finally {
        setLoadingAction(false);
      }
    };

    if (error || !data || data?.length < 1) {
      return (
        <div className="flex flex-col items-center my-4">
          <span
            className={`${
              error ? "text-red-600" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {error || `No ${title} found`}
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col overflow-y-scroll max-h-96">
        {data.map(
          (
            e: {
              id: number;
              avatar: string;
              username: string;
              name: string;
              followers: number[];
            },
            idx: number
          ) => (
            <div
              className={`${styles.userCard} ${
                idx === data?.length - 1 ? "remove-mb" : ""
              }`}
              key={idx}
            >
              <Avatar
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
              {ownUserId !== e?.id ? (
                <Button
                  fullWidth
                  variant="contained"
                  style={{textTransform: "none"}}
                  className={`${styles.btnFollow} ${
                    isFollowing(e?.followers || [])
                      ? "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 dark:bg-zinc-400 dark:hover:bg-zinc-500"
                      : "bg-primary"
                  }`}
                  disabled={loadingAction}
                  onClick={() => onClickActionButton(e?.id)}
                >
                  {isFollowing(e?.followers || []) ? "Following" : "Follow"}
                </Button>
              ) : null}
            </div>
          )
        )}
      </div>
    );
  }, [
    data,
    error,
    router,
    toggle,
    ownUserId,
    loadingAction,
    accessToken,
    title,
    setRefetchProfile,
  ]);

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
          {loading && !data ? (
            <Fragment>
              {loading ? (
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

export default ModalSearch;
