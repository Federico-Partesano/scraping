import { Input } from "@chakra-ui/react";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import Loader from "../../components/Loader/Loader";
import useYouTubeSearch from "../../hooks/useYouTubeSearch";
import { RootState } from "../../redux/reducers";
import { setSelectedVideoPageState } from "../../redux/reducers/selectedVideoPage";
import "./Home.scss";

interface IHome {}

const Home: FC<IHome> = () => {
  const {
    configuration: { folder },
  } = useSelector((st: RootState) => st.configuration);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, fetchSearch, loading } = useYouTubeSearch();

  const handleFetchVideos = useCallback(
    ({ key }: { key: string }) => {
      console.log("🚀 ~ file: Home.tsx:151 ~ key:", inputValue);
      key === "Enter" && inputValue && fetchSearch(inputValue);
    },
    [inputValue]
  );

  return (
    <div className="container__home">
      <h2 className="container__title">Video</h2>
      <Input
        value={inputValue}
        onChange={({ target: { value } }) => setInputValue(value)}
        onKeyDown={({ key, target: { value } }) => {
          key === "Enter" && value && fetchSearch(value);
        }}
        className="home__search__input"
        placeholder="Cerca..."
      />
      <CustomButton
        className="ms-3"
        label="CERCA"
        onClick={() => {
          inputValue && fetchSearch(inputValue);
        }}
      />
      {/* // @ts-ignore */}
      <div className="row mx-4">
        {loading && <Loader />}
        {data &&
          data.map((video) => {
            const {
              title,
              id,
              thumbnail: { thumbnails },
              length,
            } = video;
            return (
              <div key={id} className="col-6 col-sm-4 col-md-3 col-xl-2 mt-5">
                <div className="position-relative container__image__card">
                  <img
                    src={thumbnails[0].url}
                    className="image"
                    alt={title}
                  ></img>
                  <div className="over__layer">
                    <div
                      className="circle"
                      onClick={() => {
                        dispatch(setSelectedVideoPageState(video));
                        navigate("/single-video");
                      }}
                    >
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24.000000pt"
                        height="24.000000pt"
                        viewBox="0 0 30.000000 30.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)"
                          fill="#f9ab00"
                          stroke="none"
                        >
                          <path
                            d="M50 150 c0 -66 3 -120 6 -120 12 0 214 114 214 120 0 7 -201 120
                              -213 120 -4 0 -7 -54 -7 -120z"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="card__title">{title}</h3>
                <div className="d-flex justify-content-between w-100">
                  <span className="duration">{`durata: ${
                    length?.simpleText ?? ""
                  }`}</span>
                  {/* <span className="text-white">ciao</span> */}
                </div>
              </div>
              // <AspectRatio h="300px" className="col-4 mt-3" ratio={1}>
              //   <iframe
              //     key={title}
              //     src={`https://www.youtube.com/embed/${id}`}
              //     frameBorder="0"
              //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              //     allowFullScreen
              //     style={{ padding: 20 }}
              //     title="Embedded youtube"
              //   />
              // </AspectRatio>
            );
          })}
      </div>
    </div>
  );
};
export default Home;
