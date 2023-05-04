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
  const [controller, setController] = useState<AbortController | null>(null);

  const hitApi = async (payload: any = {}) => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      const {data} = await api({
        signal: controller?.signal,
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
    if (!controller) {
      setController(new AbortController());
    }
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [controller]);

  return [hitApi, {data, loading, error}];
};
export default useMutation;
