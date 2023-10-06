import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, {
  FC,
  Fragment,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { setSelectedVideoPageState } from "../../redux/reducers/selectedVideoPage";
import CustomButton from "../CustomButton/CustomButton";
import Loader from "../Loader/Loader";
import "./DrawerHomeSelectedVideo.scss";

interface IDrawerHomeSelectedVideo {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const DrawerHomeSelectedVideo: FC<IDrawerHomeSelectedVideo> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const toast = useToast();
  const [percentualDownload, setPercentualDownload] = useState<
    number | undefined
  >(undefined);
  const dispatch = useDispatch();
  const [downloading, setDownloading] = useState<
    "start" | "downloading" | "completed" | "error"
  >("start");

  const { selectedVideo: video } = useSelector(
    (st: RootState) => st.selectedVideoPage
  );
  useLayoutEffect(() => {
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

  useEffect(() => {
    video ? onOpen() : onClose();
    // eslint-disable-next-line
  }, [video]);

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={"full"}>
      <DrawerOverlay />
      <DrawerContent>
        <div
          className="arrow-drawer"
          onClick={() => {
            dispatch(setSelectedVideoPageState(undefined));
          }}
        >
          <ArrowForwardIcon className="icon" boxSize={4} />
        </div>
        <DrawerHeader color={"white"} backgroundColor={"#222028"}>
          <p>{video?.title || ""}</p>
        </DrawerHeader>
        <DrawerBody backgroundColor={"#1a1920"}>
          <div className="container__single__video">
            <div>
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

              {video && (
                <Fragment>
                  {/* <h1 className="title">{video.title}</h1> */}
                  <AspectRatio className="video" marginTop={"100px"} ratio={3}>
                    <iframe
                      key={video.title}
                      src={`https://www.youtube.com/embed/${video.id}?autoplay=1&cc_load_policy=1&color=null&controls=1&disablekb=0&enablejsapi=0&end=null&fs=1&h1=null&iv_load_policy=1&listType=null&loop=0&modestbranding=null&mute=0&origin=null&playsinline=null&rel=0&showinfo=1&start=0&wmode=transparent&theme=dark&nocookie=false`}
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
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerHomeSelectedVideo;
