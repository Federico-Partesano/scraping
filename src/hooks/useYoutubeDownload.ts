import axios from "axios";
import { useEffect, useState } from "react";
import { pathApi } from "../enviroument";

const useYouTubeDownload = () => {
  const [percentualDownload, setPercentualDownload] = useState<
    number | undefined
  >(undefined);
  const downloadVideo = async (videoId: string) => {
    try {
      const { data } = await axios.get<any>(
        `${pathApi}/youtube/song?videoId=${videoId}`
      );
      return data;
    } catch (e: any) {
      console.error("resp", e);
      return undefined;
    }
  };

  useEffect(() => {
    (window as any).api.receive(
      "percentualDownload",
      (percentual: "error" | number) => {
        percentual !== "error" && setPercentualDownload(percentual);
      }
    );
  }, []);

  return { downloadVideo, percentualDownload, setPercentualDownload } as const;
};

export default useYouTubeDownload;
