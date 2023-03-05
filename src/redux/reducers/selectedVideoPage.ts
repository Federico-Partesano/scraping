import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RespVideoSearch } from '../../models/Resp'
import { Song } from '../../pages/Songs/Songs'

interface SelectedVideoPageState {
  selectedVideo: RespVideoSearch | undefined
}

const initialState = { selectedVideo: undefined } as SelectedVideoPageState

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {

    setSelectedVideoPageState(state: SelectedVideoPageState, {payload}: PayloadAction<RespVideoSearch | undefined>) {
      state.selectedVideo = payload
    },
  },
})

export const { setSelectedVideoPageState } = customersSlice.actions
export default customersSlice.reducer