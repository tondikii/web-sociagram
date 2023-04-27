import "../styles/globals.css";
import type {AppProps} from "next/app";
import Layout from "../components/Layout";
import {wrapper} from "../store/index";
import {useEffect} from "react";
import {api} from "../config/api";
import {getProfileApi} from "../store/api";
import Swal from "sweetalert2";
import {useDispatch} from "react-redux";
import {setSession} from "../store/reducers/root";

const App = ({Component, pageProps}: AppProps) => {
  const dispatch = useDispatch();
  const onRefresh = async () => {
    try {
      const accessToken: string = localStorage.getItem("accessToken") || "";
      if (accessToken) {
        const {data} = await getProfileApi({accessToken, data: null});
        if (data?.data?.username) {
          const {username, avatar, id} = data?.data || {};
          dispatch(setSession({accessToken, username, avatar, id}));
        }
      }
    } catch (err) {
      console.log({err});
      Swal.fire({icon: "error", title: "Failed fetch data profile"});
    }
  };
  useEffect(() => {
    onRefresh();
  }, []);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default wrapper.withRedux(App);
