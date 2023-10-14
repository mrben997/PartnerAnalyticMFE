import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { LazyStatus, TStateRedux } from '../type'
import { fetchAnalyticThunk } from './AnalyticThunk'
import { ENetwork } from '../../utils/type'

export interface IAnalyticStateRedux extends TStateRedux {
  networkSelected: ENetwork
}

// Define the initial state using that type
const initialState: IAnalyticStateRedux = {
  Status: LazyStatus.Loading,
  networkSelected: ENetwork.DinoCollab
}

export const AnalyticSlice = createSlice({
  name: 'AnalyticSlice',
  initialState,
  reducers: {
    changeNetworkSelected: (state, action: PayloadAction<ENetwork>) => {
      state.networkSelected = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticThunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.Status = LazyStatus.Loaded
      })
      .addCase(fetchAnalyticThunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.Status = LazyStatus.Error
      })
      .addCase(fetchAnalyticThunk.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.Status = LazyStatus.Loading
      })
  }
})
