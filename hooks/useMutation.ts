import {useState, useEffect, useMemo} from "react";
import {useSelector} from "react-redux";

const useMutation = (api: Function) => {
  const accessToken = useSelector(
    (state: {
      rootReducer: {
        session: {accessToken: string};
      };
    }) => state?.rootReducer?.session?.accessToken
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<null | any>(null);
  const [error, setError] = useState<any | null>(null);

  const abortController = useMemo(() => new AbortController(), []);
  const hitApi = async (payload: any = {}) => {
    try {
      const {data} = await api({
        signal: abortController?.signal,
        accessToken,
        ...payload,
      });
      setData(data?.data);
      setLoading(false);
    } catch (err: any) {
      if (err?.name !== "AbortError" || err?.message !== "canceled") {
        setError(err);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => abortController.abort();
  }, [abortController]);

  return [hitApi, {data, loading, error}];
};
export default useMutation;
