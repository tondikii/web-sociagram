import type {NextComponentType, NextPageContext} from "next";
import {useRouter} from "next/router";
import {HeartIcon} from "@heroicons/react/outline";
import {HeartIcon as HeartIconSolid} from "@heroicons/react/solid";
import Link from "next/link";

interface Props {}

const TopBar: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {pathname} = useRouter();
  return (
    <div className="fixed flex flex-row justify-around p-4 lg:hidden">
      <span>Sociagram</span>
      <input
        name="user"
        type="text"
        placeholder="Search username..."
        className="border bg-white dark:bg-black border-zinc-300 dark:border-zinc-800 rounded-md p-1 w-full text-lg h-12 pl-10 pb-1"
      />
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
