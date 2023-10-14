import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface Data {
  ID: number;
  "Nome e Cognome ": string;
  "E-mail": string;
  Domicilio: string;
  "Area Aziendale": string;
  CV: string;
  "Data Ultima Modifica": string;
  "Data&nbsp;Colloquio": string;
  "Data Inserimento Valutazione": string;
  "Data Ultima&nbsp;Modifica  Valutazione": string;
}

interface ConfigurationState {
  configuration: {
    file: string | undefined;
    users: Data[];
    sessionId: string | undefined;
  };
}

const initialState = {
  configuration: { file: undefined, users: [], sessionId: undefined },
} as ConfigurationState;

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setFileConfiguration(
      state: ConfigurationState,
      { payload }: PayloadAction<string>
    ) {
      state.configuration.file = payload;
    },
    setUsers(state: ConfigurationState, { payload }: PayloadAction<Data[]>) {
      state.configuration.users = payload;
    },
    setSessionId(
      state: ConfigurationState,
      { payload }: PayloadAction<string | undefined>
    ) {
      state.configuration.sessionId = payload;
    },
  },
});

export const { setFileConfiguration, setUsers, setSessionId } =
  customersSlice.actions;
export default customersSlice.reducer;
