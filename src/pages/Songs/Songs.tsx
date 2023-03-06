import React, {
  FC,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Loader from "../../components/Loader/Loader";
import AudioPlayer from "react-modern-audio-player";
import "./Songs.scss";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { formatDuration } from "../../utils/formatDuration";
import { DeleteIcon } from "@chakra-ui/icons";
import CustomButton from "../../components/CustomButton/CustomButton";

interface ISongs {}

export interface Song {
  path: string;
  name: string;
  tags?: { id?: string; duration?: number };
}

const Footer: FC<{ songs: Song[]; audioRef: any; selectedSong?: number }> = ({
  songs,
  audioRef,
  selectedSong,
}) => {
  const playList = songs.map(({ name, path, tags }, index) => {
    return {
      name: name,
      writer: " ",
      img: `https://img.youtube.com/vi/${tags?.id || ""}/hqdefault.jpg`,
      src: path,
      id: index + 1,
    };
  });
  return (
    <div style={{ color: "white" }}>
      <AudioPlayer
        audioRef={audioRef}
        activeUI={{ all: true, progress: "waveform" }}
        playList={playList}
        placement={{ player: "bottom" }}
        audioInitialState={
          selectedSong
            ? { curPlayId: selectedSong, isPlaying: true }
            : undefined
        }
      />
    </div>
  );
};

const Songs: FC<ISongs> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [songs, setSongs] = useState<"error" | undefined | Song[]>(undefined);
  const [favoritesId, setFavoritesId] = useState<string[]>([]);
  const [selectedSong, setSelectedSong] = useState<number>();
  const [selectedFavorites, setSelectedFavorites] = useState(false);
  const [selectedSongToRemove, setSelectedSongToRemove] = useState<Song>();
  const [counterSongs, setCounterSongs] = useState(0);
  const [searchInput, setSearchInput] = useState<string>("");

  function updateCount(endValue: number) {
    setCounterSongs((prevCount) => {
      const diff = endValue - prevCount;
      const increment = diff / 20; // incremento per ogni frame
      return Math.abs(diff) < 1 ? endValue : prevCount + increment;
    });
  }

  const filterSongsByFavorites = (inputSongs: typeof songs) => {
    if (inputSongs === "error") return inputSongs;
    if (!selectedFavorites) {
      updateCount(inputSongs!.length);
      return inputSongs;
    }
    const filteredSongs = inputSongs?.filter(({ tags }) =>
      favoritesId.some((idSong) => idSong === tags?.id)
    );
    updateCount(filteredSongs!.length);
    return filteredSongs;
  };

  const filteredSongs = useMemo(() => {
    if (!songs) return undefined;
    if (songs === "error") return "error";
    if (!searchInput) return filterSongsByFavorites(songs);
    return filterSongsByFavorites(
      songs.filter(({ name }) =>
        name.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, songs, selectedFavorites, favoritesId]);

  useEffect(() => {
    let frameId: any;
    if (!filteredSongs) return;
    function tick() {
      updateCount(filteredSongs!.length);
      if (counterSongs !== filteredSongs!.length) {
        frameId = requestAnimationFrame(tick);
      }
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [counterSongs, filteredSongs?.length]);

  useEffect(() => {
    filteredSongs && updateCount(filteredSongs.length);
  }, [filteredSongs]);

  const audioRef = useRef(null);
  useEffect(() => {
    (window as any).api.receive("getMP3Files", (allSongs: any) => {
      setSongs(allSongs);
    });
    (window as any).api.receive(
      "getFavorites",
      (allFavorites: string[] | "error") => {
        allFavorites !== "error" && setFavoritesId(allFavorites);
      }
    );
    (window as any).api.receive("addFavorite", (idSong: string | "error") => {
      if (idSong !== "error") setFavoritesId((prev) => [...prev, idSong]);
    });
    (window as any).api.receive(
      "deleteFavorite",
      (favoriteSongs: string[] | "error") => {
        if (favoriteSongs !== "error") setFavoritesId(favoriteSongs);
      }
    );
    (window as any).api.receive("removeSong", (nameSong: string) => {
      if (nameSong !== "error") {
        setSongs((prev) => {
          if (prev === "error" || !prev) return prev;
          return prev.filter((song) => song.name !== nameSong);
        });
      }
      onClose();
    });

    (window as any).api.send("getFavorites");
    (window as any).api.send("getMP3Files");
  }, []);

  useEffect(() => {
    selectedSongToRemove && onOpen();
  }, [selectedSongToRemove]);
  useEffect(() => {
    !isOpen && setSelectedSongToRemove(undefined);
  }, [isOpen]);

  const handleAddFavorite = (id: string | undefined) => {
    if (id) (window as any).api.send("addFavorite", id);
  };
  const handleDeleteFavorite = (id: string | undefined) => {
    if (id) (window as any).api.send("deleteFavorite", id);
  };

  return (
    <>
      <div className="main__container container__songs">
        <div className="d-flex justify-content-center align-items-center gap-3">
          <Input
            onChange={({ target: { value } }) => setSearchInput(value)}
            width={"50%"}
            placeholder="Cerca per nome..."
            className="songs__search__input"
          />
          <Checkbox
            size={"md"}
            isChecked={selectedFavorites}
            onChange={({ target: { checked } }) =>
              setSelectedFavorites(checked)
            }
          >
            Preferiti
          </Checkbox>
        </div>
        {filteredSongs === undefined && <Loader />}
        {filteredSongs === "error" && <h1> Error </h1>}
        {filteredSongs && filteredSongs !== "error" && (
          <Fragment>
            {/* <h1
            onClick={() => {
              handleStart();
            }}
          >
            start
          </h1> */}
            <div className="table__container">
              {/* <div className="header">
              <div className="index__section">
                <span>#</span>
              </div>
              <span>Titolo</span>
            </div> */}
              <div className="songs">
                <p className="counter__songs">{`${counterSongs.toFixed()} brani`}</p>
                <div className="grid-container">
                  <div className="grid-item text-start border-bottom-header d-flex align-items-center justify-content-center">
                    #
                  </div>
                  <div className="grid-item text-start border-bottom-header d-flex align-items-center">
                    Titolo
                  </div>
                  <div className="grid-item d-flex justify-content-end border-bottom-header d-flex align-items-center justify-content-end pe-4">
                    <svg
                      role="img"
                      height="16"
                      width="16"
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      data-encore-id="icon"
                      className="Svg-sc-ytk21e-0 uPxdw"
                    >
                      <path
                        fill="#b3b3b3"
                        d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"
                      ></path>
                      <path
                        fill="#b3b3b3"
                        d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"
                      ></path>
                    </svg>
                  </div>
                  {filteredSongs.map((song, index) => {
                    return (
                      <Fragment key={index}>
                        <div
                          className={`grid-item d-flex align-items-center justify-content-center ${
                            selectedSong === index + 1 ? "selected" : ""
                          }`}
                        >
                          <span className="index">{index + 1}</span>
                        </div>
                        <div
                          className={`grid-item d-flex align-items-center cursor-pointer ${
                            selectedSong === index + 1 ? "selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedSong(index + 1);
                          }}
                        >
                          <img
                            alt={song.name}
                            className={"image"}
                            src={`https://img.youtube.com/vi/${song.tags?.id}/hqdefault.jpg`}
                          />
                          <span className="title ms-3">{song.name}</span>
                        </div>
                        <div
                          className={`grid-item d-flex align-items-center justify-content-end gap-3 pe-4 ${
                            selectedSong === index + 1 ? "selected" : ""
                          }`}
                        >
                          {song.tags?.id ? (
                            favoritesId.some((id) => song.tags?.id === id) ? (
                              <div>
                                <svg
                                  role="img"
                                  height="16"
                                  width="16"
                                  aria-hidden="true"
                                  viewBox="0 0 16 16"
                                  data-encore-id="icon"
                                  className="cursor-pointer"
                                  onClick={() => {
                                    handleDeleteFavorite(song.tags?.id);
                                  }}
                                >
                                  <path
                                    fill="#1ed760"
                                    d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z"
                                  ></path>
                                </svg>
                              </div>
                            ) : (
                              // @ts-ignore
                              // <Tooltip
                              //   label="Hey, I'm here!"
                              //   aria-label="A tooltip"
                              // >
                              <div className="unfavorite">
                                <svg
                                  role="img"
                                  height="16"
                                  width="16"
                                  aria-hidden="true"
                                  viewBox="0 0 16 16"
                                  data-encore-id="icon"
                                  className="cursor-pointer"
                                  onClick={() => {
                                    handleAddFavorite(song.tags?.id);
                                  }}
                                >
                                  <path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"></path>
                                </svg>
                              </div>
                              // </Tooltip>
                            )
                          ) : (
                            <></>
                          )}
                          <DeleteIcon
                            cursor={"pointer"}
                            transition={"color .1s linear"}
                            color={"red.300"}
                            _hover={{ color: "red.400" }}
                            onClick={() => {
                              setSelectedSongToRemove(song);
                            }}
                          />
                          <span className="duration">
                            {song.tags?.duration
                              ? formatDuration(song.tags.duration)
                              : "0:00"}
                          </span>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
            {songs && songs !== "error" && Boolean(songs.length) && (
              <Footer
                audioRef={audioRef}
                selectedSong={selectedSong}
                songs={songs}
              />
            )}
          </Fragment>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader background={"#2f2b37"}>
            <span className="modal__title">Conferma</span>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody background={"#2f2b37"} textAlign={"center"}>
            <p>Sicuro di voler rimuovere:</p>
            <p>{selectedSongToRemove?.name || ""}</p>
          </ModalBody>

          <ModalFooter
            background={"#2f2b37"}
            display={"flex"}
            justifyContent={"center"}
          >
            <CustomButton
              label="CONFERMA"
              onClick={() => {
                (window as any).api.send("removeSong", {
                  name: selectedSongToRemove?.name,
                  id: selectedSongToRemove?.tags?.id,
                });
              }}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Songs;
