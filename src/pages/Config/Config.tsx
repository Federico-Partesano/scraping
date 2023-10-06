import { Button, Container } from "@chakra-ui/react";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton/CustomButton";
import { RootState } from "../../redux/reducers";
import "./Config.scss";
import { useNavigate } from "react-router-dom";

interface IConfig {}

const Config: FC<IConfig> = () => {
  const {
    configuration: { file },
  } = useSelector((st: RootState) => st.configuration);

  return (
    <div className="main__container config__container">
      <Container maxW={"container.xl"}>
        <div className="card">
          <h3 className="title">Cartella di configurazione</h3>
          <p className="description">
            La cartella di configurazione serve come destinazione in cui salvare
            i file mp3 scaricati.
          </p>
          <p className="description">
            Serve anche all'audio player per indicargli da dove leggere i file.
          </p>
          <p className="description cursor-pointer">
            ATTENZIONE: è consigliato non inserire manualmente file mp3 a meno
            che non siano stati creati attraverso questo applicativo, questo non
            comprometterebbe il suo funzionamento, ma semplicemente rimuoverebbe
            alcune funzionalità sui file provenienti da fonti esterne.
          </p>
          <p className="folder my-4">
            Cartella attuale: <span className="text-success">{file}</span>
          </p>
          <div>
            <CustomButton
              label="CAMBIA"
              onClick={() => {
                (window as any).api.send("setFile");
              }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Config;
