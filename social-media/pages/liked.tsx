import type {NextComponentType, NextPageContext} from "next";
import styles from "../styles/Liked.module.css";
import {HeartIcon} from "@heroicons/react/solid";

interface Props {}

const Liked: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  return (
    <div className={`${styles.container} verticalCenter`}>
      <div className={`${styles.postsContainer} verticalCenter`}>
        <div className="horizontalCenter">
          <HeartIcon className="h-6 w-6 text-zinc-900 dark:text-white mr-1" />
          <p>POSTS</p>
        </div>
        <hr className="w-full mt-4 mb-8" />
        <div className="grid grid-cols-3 gap-8 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((el) => (
            <div className="" key={el}>
              <img
                className="w-full h-full"
                src="https://pbs.twimg.com/profile_images/1284155869060571136/UpanAYid_400x400.jpg"
                alt="https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Liked;
