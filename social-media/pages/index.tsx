import type {NextComponentType, NextPageContext} from "next";
import styles from "../styles/Home.module.css";
import PostCard from "../components/PostCard.";

interface Props {}

const Home: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  return (
    <div className={`${styles.container} verticalCenter`}>
      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
};

export default Home;
