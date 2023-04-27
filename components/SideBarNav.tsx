import type {NextComponentType, NextPageContext} from "next";
import Link from "next/link";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState, Fragment} from "react";
import styles from "../styles/SideBarNav.module.css";
import {
  HomeIcon,
  HeartIcon,
  PlusCircleIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import {
  HomeIcon as HomeIconSolid,
  HeartIcon as HeartIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
} from "@heroicons/react/solid";
import ModalSearch from "./ModalSearch";
import ModalCreate from "./ModalCreate";
import {Avatar} from "@mui/material";
import {useSelector} from "react-redux";

interface Props {}

interface Session {
  accessToken: string;
  id: number;
  username: string;
  avatar: string;
}

const SideBarNav: NextComponentType<NextPageContext, {}, Props> = () => {
  const {pathname, query} = useRouter();
  const {username, avatar} =
    useSelector(
      (state: {
        rootReducer: {
          session: Session;
        };
      }) => state?.rootReducer?.session
    ) || {};

  const [isProfile, setIsProfile] = useState(false);
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [showModalCreate, setShowModalCreate] = useState(false);

  const toggleModalSearch = useCallback(() => {
    setShowModalSearch(!showModalSearch);
  }, [showModalSearch]);

  const toggleModalCreate = useCallback(() => {
    setShowModalCreate(!showModalCreate);
  }, [showModalCreate]);

  useEffect(() => {
    if (query?.username === username) {
      setIsProfile(true);
    } else {
      setIsProfile(false);
    }
  }, [query?.username, username]);

  return (
    <Fragment>
      <ModalSearch toggle={toggleModalSearch} open={showModalSearch} />
      <ModalCreate
        toggle={toggleModalCreate}
        open={showModalCreate}
        username={username}
        avatar={avatar}
      />
      <nav className={styles.container}>
        <section className={`${styles.section} vertical h-100 container`}>
          <div className="cursor-pointer p-1 mb-8">
            <p className="ml-2 text-primary text-xl">Sociagram</p>
          </div>
          <Link
            href="/"
            className={`horizontal p-1 items-center ${styles.menuContainer} mt-4`}
          >
            {pathname === "/" ? (
              <HomeIconSolid className="text-primary h-8 w-8" />
            ) : (
              <HomeIcon className="text-primary h-8 w-8" />
            )}

            <p className="ml-2 text-primary font-bold">Home</p>
          </Link>
          <div
            onClick={toggleModalSearch}
            className={`horizontal p-1 items-center ${styles.menuContainer} mt-4`}
          >
            <SearchIcon className="text-primary h-8 w-8" />
            <p className="ml-2 text-primary">Search</p>
          </div>
          <div
            onClick={toggleModalCreate}
            className={`horizontal p-1 items-center ${styles.menuContainer} mt-4`}
          >
            <PlusCircleIcon className="text-primary h-8 w-8" />
            <p className="ml-2 text-primary">Create</p>
          </div>
          <Link
            href={"/liked"}
            className={`horizontal p-1 items-center ${styles.menuContainer} mt-4`}
          >
            {pathname.search("/liked") >= 0 ? (
              <HeartIconSolid className="text-primary h-8 w-8" />
            ) : (
              <HeartIcon className="text-primary h-8 w-8" />
            )}
            <p className="ml-2 text-primary">Liked</p>
          </Link>
        </section>
        <section
          className={`${styles.section} h-100 flex flex-col-reverse container`}
        >
          <Link
            href={`/${username}`}
            className={`horizontal p-1 items-center ${styles.menuContainer}`}
          >
            <Avatar
              className={`rounded-full w-11 h-11 ${
                isProfile ? "border-4 border-primary" : ""
              }`}
              src={
                avatar ||
                "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
              }
              alt="https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
            />
            <div className="vertical">
              <p
                className={`ml-2 text-primary ${isProfile ? "font-bold" : ""}`}
              >
                {username}
              </p>
              <p className="ml-2 text-sm text-zinc-400">
                {isProfile ? "Viewing" : "View"} profile
              </p>
            </div>
          </Link>
        </section>
      </nav>
    </Fragment>
  );
};

export default SideBarNav;
