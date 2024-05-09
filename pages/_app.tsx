import "../styles/globals.css";
import type {AppProps} from "next/app";
import Layout from "../components/Layout";
import {wrapper} from "../store/index";
import {useEffect} from "react";
import {getProfileApi} from "../store/api";
import {useDispatch} from "react-redux";
import {setSession} from "../store/reducers/root";
import * as Alert from "../components/Alert";

const App = ({Component, pageProps}: AppProps) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const onRefresh = async () => {
      try {
        const accessToken: string = localStorage.getItem("accessToken") || "";
        if (accessToken) {
          const {data} = await getProfileApi({accessToken, data: null});
          if (data?.data?.username) {
            const {username, avatar, id, name} = data?.data || {};
            dispatch(setSession({accessToken, username, avatar, id, name}));
          }
        }
      } catch (err) {
        Alert.Error("Failed fetch data profile");
      }
    };
    onRefresh();
  }, [dispatch]);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default wrapper.withRedux(App);
