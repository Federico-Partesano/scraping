import axios from "axios";
import { useEffect, useState } from "react";
import { YOUTUTBE_KEY } from "../config";
import { pathApi } from "../enviroument";
import { RespVideoSearch } from "../models/Resp";

const useYouTubeSearch = () => {
  const [data, setData] = useState<RespVideoSearch[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (window as any).api.receive(
      "songs",
      (data: RespVideoSearch[] | "error") => {
        console.log("🚀 ~ file: useYouTubeSearch.ts:20 ~ useEffect ~ data:", data)
        data !== "error" && setData(data);
        setLoading(false);
      }
    );
  }, []);
  const fetchSearch = async (q: string) => {
    setLoading(true);
    (window as any).api.send("songs", q);
  };

  return { data, fetchSearch, loading } as const;
};

export default useYouTubeSearch;
