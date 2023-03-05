import React, { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import socketIOClient from "socket.io-client";
import Header from "./components/Header/Header";
import SingleVideo from "./pages/SingleVideo/SingleVideo";
import Loader from "./components/Loader/Loader";
import SelectFolder from "./pages/SelectFolder/SelectFolder";
import { useDispatch } from "react-redux";
import { setFolderConfiguration } from "./redux/reducers/configuration";
import Songs from "./pages/Songs/Songs";
import Config from "./pages/Config/Config";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({ config });

export let socketConnection: ReturnType<typeof socketIOClient> | null = null;
function App() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(false);
  useEffect(() => {
    (window as any).api.receive(
      "getFolderSongs",
      (folder: string | undefined) => {
        folder && setSelectedFolder(true);
        folder && dispatch(setFolderConfiguration(folder));
        setIsReady(true);
      }
    );
    (window as any).api.receive(
      "setFolderSongs",
      (folder: string | undefined) => {
        if (folder) {
          dispatch(setFolderConfiguration(folder));
          setSelectedFolder(true);
        }
      }
    );
  }, []);

  useLayoutEffect(() => {
    (window as any).api.send("getFolderSongs");
  }, []);

  if (!isReady) return <Loader />;

  if (!selectedFolder) return <SelectFolder />;

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Header />}>
              <Route path="home" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/single-video" element={<SingleVideo />} />
              <Route path="/songs" element={<Songs />} />
              <Route path="/config" element={<Config />} />
            </Route>
          </Routes>
        </div>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
