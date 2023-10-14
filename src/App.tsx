import React, { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import Header from "./components/Header/Header";
import Loader from "./components/Loader/Loader";
import SelectFolder from "./pages/SelectFolder/SelectFolder";
import { useDispatch, useSelector } from "react-redux";
import { setFileConfiguration, setUsers } from "./redux/reducers/configuration";
import Songs from "./pages/Songs/Songs";
import Config from "./pages/Config/Config";
import { RootState } from "./redux/reducers";
import Login from "./pages/Login/Login";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({ config });

function App() {
  const dispatch = useDispatch();
  const {sessionId} = useSelector((st: RootState) => st.configuration.configuration)
  const [isReady, setIsReady] = useState(false);
  const [selectedFile, setSelectedFile] = useState(false);
  useEffect(() => {
    (window as any).api.receive(
      "getFolderSongs",
      (file: string | undefined) => {
        file && setSelectedFile(true);
        file && dispatch(setFileConfiguration(file));
        setIsReady(true);
      }
    );
    (window as any).api.receive("getFile", (file: string | undefined) => {
      console.log("🚀 ~ file: App.tsx:36 ~ file:", file);
      if (file) {
        dispatch(setFileConfiguration(file));
        setSelectedFile(true);
      }
      setIsReady(true);
    });
    (window as any).api.receive("setFile", (file: string | undefined) => {
      console.log("🚀 ~ file: App.tsx:36 ~ file:", file);
      if (file) {
        dispatch(setFileConfiguration(file));
        setSelectedFile(true);
      }
    });
    (window as any).api.receive("getDataFile", (users: any) => {
      if (users) {
        dispatch(setUsers(users));
      }
    });
  }, []);

  useLayoutEffect(() => {
    (window as any).api.send("getFile");
    console.log("setFile");
  }, []);

  if (!isReady) return <Loader />;

  if (!selectedFile) return <Config />;
  if (!sessionId) return <Login />;
  
  return (
    <MemoryRouter>
      <ChakraProvider theme={theme}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Header />}>
              <Route path="home" element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </div>
      </ChakraProvider>
    </MemoryRouter>
  );
}

export default App;
