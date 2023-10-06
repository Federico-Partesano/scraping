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
  configuration: { file: string | undefined; users: Data[] };
}

const initialState = {
  configuration: { file: undefined, users: [] },
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
  },
});

export const { setFileConfiguration, setUsers } = customersSlice.actions;
export default customersSlice.reducer;
