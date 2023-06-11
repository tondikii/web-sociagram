import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import {HeartIcon, SearchIcon} from "@heroicons/react/outline";
import {HeartIcon as HeartIconSolid} from "@heroicons/react/solid";
import Link from "next/link";
import ReactLoading from "react-loading";

import styles from "../styles/TopBar.module.css";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useMutation from "../hooks/useMutation";
import {searchUsersApi} from "../store/api";
import {debounce} from "lodash";
import UserCard from "./UserCard";

interface Props {}

const TopBar: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const router = useRouter();
  const {pathname} = router;

  const [searchState, setSearchState] = useState("");
  const [users, setUsers] = useState([]);
  const [searchUsers, {data, loading, error}]: any[] =
    useMutation(searchUsersApi);
  const [typing, setTyping] = useState<boolean>(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);

  const scrolling = () => {
    let prevScrollpos = window?.pageYOffset;
    window.onscroll = () => {
      let currentScrollPos = window?.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
      prevScrollpos = currentScrollPos;
    };
  };

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
        <div className="flex flex-col items-center py-4 bg-black rounded">
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
                router.push(`/${e?.username}`);
              }}
              user={e}
              key={idx}
            />
          )
        )}
      </div>
    );
  }, [users, error, searchState, router, typing]);

  useEffect(() => {
    if (data?.rows.length && Array.isArray(data?.rows)) {
      if (searchState) {
        setUsers(data?.rows);
      } else {
        setUsers([]);
      }
    } else {
      setUsers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.rows]);

  useEffect(() => {
    scrolling();
  });

  return (
    <div
      className={`${styles.container} ${
        showNavbar || searchState ? "" : styles.hideNavbar
      }`}
    >
      <span
        onClick={() => {
          router.push("/");
        }}
      >
        Sociagram
      </span>
      <div className="w-1/2">
        <div className={styles.iconContainer}>
          <SearchIcon className={styles.icon} />
        </div>
        <input
          name="user"
          type="text"
          placeholder="Type username..."
          className={styles.input}
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
          <div className="fixed w-48">{UsersComponent}</div>
        )}
      </div>
      <Link
        href={"/liked"}
        className=" rounded-full hover:bg-fuchsia-50 dark:hover:bg-zinc-900 cursor-pointer items-center"
      >
        {pathname.search("/liked") >= 0 ? (
          <HeartIconSolid className="text-primary h-8 w-8" />
        ) : (
          <HeartIcon className="text-primary h-8 w-8" />
        )}
      </Link>
    </div>
  );
};

export default TopBar;
