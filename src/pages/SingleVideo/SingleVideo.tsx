import { AspectRatio, useToast } from "@chakra-ui/react";
import React, {
  FC,
  Fragment,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { RespVideoSearch } from "../../models/Resp";
import "./SingleVideo.scss";
import CustomButton from "../../components/CustomButton/CustomButton";
import Loader from "../../components/Loader/Loader";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";

interface ISingleVideo {}

const SingleVideo: FC<ISingleVideo> = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [percentualDownload, setPercentualDownload] = useState<
    number | undefined
  >(undefined);
  const [downloading, setDownloading] = useState<
    "start" | "downloading" | "completed" | "error"
  >("start");

  const { selectedVideo: video } = useSelector(
    (st: RootState) => st.selectedVideoPage
  );
  useLayoutEffect(() => {
    if (!video) {
      navigate(-1);
      return;
    }

    (window as any).api.receive(
      "downloadSong",
      (status: string | undefined) => {
        status === "downloading" && setDownloading("downloading");
        if (status === "await") {
          downloading !== "completed" && setDownloading("completed");
          setPercentualDownload(undefined);
        }
        status === "error" && setDownloading("error");
      }
    );
    (window as any).api.receive(
      "percentualDownload",
      (percentual: "error" | number) => {
        percentual !== "error" && setPercentualDownload(percentual);
      }
    );

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    downloading === "completed" &&
      toast({
        title: "Download terminato",
        description:
          "Vai nella sezione musica scaricata per vedere la tua musica",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    downloading === "error" &&
      toast({
        title: "Errore download",
        description: "Errore imprevisto",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    // eslint-disable-next-line
  }, [downloading]);

  const handleDownloadVideo = () => {
    video &&
      (window as any).api.send("downloadSong", {
        videoId: video.id,
        title: video.title,
      });
  };

  return (
    <div className="container__single__video">
      {downloading === "downloading" && (
        <Loader
          isIndeterminateProgressBar={percentualDownload === 100}
          valueProgressBar={percentualDownload}
          label={
            percentualDownload === 100
              ? "conversione in mp3"
              : percentualDownload !== undefined
              ? `${percentualDownload}%`
              : undefined
          }
        />
      )}
      <div
        className="arrow"
        onClick={() => {
          navigate(-1);
        }}
      >
        <ArrowBackIcon className="icon" boxSize={4} />
      </div>
      {video && (
        <Fragment>
          <h1 className="title">{video.title}</h1>
          <AspectRatio className="video" ratio={3}>
            <iframe
              key={video.title}
              src={`https:www.youtube.com/embed/${video.id}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </AspectRatio>
          <div className="d-flex justify-content-center mt-4">
            <CustomButton
              label="DOWNLOAD MP3"
              onClick={() => {
                handleDownloadVideo();
              }}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default SingleVideo;
