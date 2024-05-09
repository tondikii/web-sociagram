import type {NextComponentType, NextPageContext} from "next";
import {
  useState,
  useCallback,
  useMemo,
  Fragment,
  useEffect,
  useRef,
} from "react";
import {debounce} from "lodash";
import {useRouter} from "next/router";

import {Modal, Box, Divider} from "@mui/material";
import {SearchIcon, XIcon} from "@heroicons/react/outline";
import ReactLoading from "react-loading";
import {searchUsersApi} from "../store/api";

import styles from "../styles/ModalSearch.module.css";
import useMutation from "../hooks/useMutation";
import UserCard from "./UserCard";
import {useSelector} from "react-redux";

interface Props {
  open: boolean;
  toggle: Function;
  onClickUser?: Function;
}

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  boxShadow: 24,
};

const ModalSearch: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {open, toggle, onClickUser} = props;
  const router = useRouter();
  const id = useSelector(
    (state: {rootReducer: {session: {id: number}}}) =>
      state?.rootReducer?.session?.id
  );

  const [searchState, setSearchState] = useState("");
  const [users, setUsers] = useState([]);
  const [searchUsers, {data, loading, error}]: any[] =
    useMutation(searchUsersApi);
  const [typing, setTyping] = useState<boolean>(false);

  const debouncedSearch = useRef(
    debounce(async (value: string) => {
      try {
        await searchUsers({
          accessToken: localStorage.getItem("accessToken"),
          data: value,
        });
      } finally {
        setTyping(false);
      }
    }, 300)
  ).current;

  const handleChangeForm = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const {value} = e.target;
      setSearchState(value);
      setTyping(true);
      if (value) {
        debouncedSearch(value);
      }
    },
    [debouncedSearch]
  );

  const UsersComponent = useMemo(() => {
    if (!searchState || typing) return null;
    if (searchState && (error || users.length < 1)) {
      const errorMessage = error?.response?.data?.error || "";
      return (
        <div className="flex flex-col items-center my-4">
          <span
            className={`${
              errorMessage ? "text-red-600" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {errorMessage || "No users found"}
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col overflow-y-scroll max-h-96">
        {users.map(
          (e: {avatar: string; username: string; name: string}, idx) => (
            <UserCard
              onClick={(event) => {
                event.preventDefault();
                setSearchState("");
                setUsers([]);
                toggle();
                if (onClickUser) {
                  onClickUser(e);
                } else {
                  router.push(`/${e?.username}`);
                }
              }}
              user={e}
              key={idx}
            />
          )
        )}
      </div>
    );
  }, [users, error, searchState, router, toggle, typing, onClickUser]);

  useEffect(() => {
    if (data?.rows.length && Array.isArray(data?.rows)) {
      if (searchState) {
        setUsers(data?.rows?.filter((e: {id: number}) => e?.id !== id));
      } else {
        setUsers([]);
      }
    } else {
      setUsers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.rows]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxStyle} className="bg-white dark:bg-zinc-800 rounded-lg">
        <div className="p-4 flex justify-between items-center">
          <span className="text-2xl font-medium">Search Users</span>
          <XIcon
            className={styles.iconClose}
            onClick={() => {
              setSearchState("");
              setUsers([]);
              toggle();
            }}
          />
        </div>

        <Divider className="dark:bg-zinc-400" />
        <div className="p-4 items-center">
          <div className={styles.iconContainer}>
            <SearchIcon className={styles.icon} />
          </div>
          <input
            name="user"
            type="text"
            placeholder="Type username..."
            className={`${styles.input}`}
            onChange={handleChangeForm}
            value={searchState}
          />
          {loading && !users?.length ? (
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
