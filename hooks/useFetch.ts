import {useState, useEffect, useCallback} from "react";
import {useSelector} from "react-redux";

interface Props {
  api: Function;
  payload?: any;
  prevent?: boolean;
  refetch?: boolean;
  setRefetch?: Function;
}
const useFetch = ({
  api,
  payload = {},
  prevent = false,
  refetch = false,
  setRefetch = () => {},
}: Props) => {
  const accessToken = useSelector(
    (state: {
      rootReducer: {
        session: {accessToken: string};
      };
    }) => state?.rootReducer?.session?.accessToken
  );
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const abortController: AbortController = new AbortController();

  const getData = useCallback(async () => {
    try {
      if (!accessToken) {
        return;
      }
      const {data} = await api({
        signal: abortController.signal,
        accessToken,
        ...payload,
      });
      setData(data?.data);
      setLoading(false);
      setRefetch(false);
    } catch (err: any) {
      if (err?.name !== "AbortError" || err?.message !== "canceled") {
        setError(err);
        setLoading(false);
        setRefetch(false);
      }
    }
  }, [abortController.signal, accessToken, api, payload, setRefetch]);

  useEffect(() => {
    if (api && !prevent && accessToken) {
      getData();
    }
    return () => abortController.abort();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, accessToken, prevent]);

  useEffect(() => {
    if (refetch) {
      setLoading(true);
      setData(null);
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  return {data, loading, error};
};
export default useFetch;
