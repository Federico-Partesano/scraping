import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ConfigurationState {
  configuration: {folder: string | undefined}
}

const initialState = { configuration: {folder: undefined} } as ConfigurationState

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {

    setFolderConfiguration(state: ConfigurationState, {payload}: PayloadAction<string>) {
      state.configuration.folder = payload
    },
  },
})

export const { setFolderConfiguration } = customersSlice.actions
export default customersSlice.reducer