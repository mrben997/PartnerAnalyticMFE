import { Dictionary, EntityState, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { LazyStatus, TStateRedux } from '../../type'
import { fetchAvancedModeConfigThunk, fetchAvancedModeThunk } from './AvancedModeThunk'
import { INetwork } from '../../../utils/type'

export interface IAvancedModeStateRedux extends TStateRedux {
  chartStatus: LazyStatus
  networks: INetwork[]
  networkIndex: number
  dateIndex: number
  metricIndex: number
}

// Define the initial state using that type
const initialState: IAvancedModeStateRedux = {
  status: LazyStatus.Loading,
  chartStatus: LazyStatus.Loading,
  dateIndex: 0,
  networks: [],
  networkIndex: 0,
  metricIndex: 0
}

export const AvancedModeSlice = createSlice({
  name: 'AvancedModeSlice',
  initialState,
  reducers: {
    setNetworkIndex: (state, action: PayloadAction<number>) => {
      state.networkIndex = action.payload
    },
    setDateIndex: (state, action: PayloadAction<number>) => {
      state.dateIndex = action.payload
    },
    setMetricIndex: (state, action: PayloadAction<number>) => {
      state.metricIndex = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvancedModeThunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.chartStatus = LazyStatus.Loaded
      })
      .addCase(fetchAvancedModeThunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.chartStatus = LazyStatus.Error
      })
      .addCase(fetchAvancedModeThunk.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.chartStatus = LazyStatus.Loading
      })

    builder
      .addCase(fetchAvancedModeConfigThunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = LazyStatus.Loaded

        state.networks = action.payload.networks
      })
      .addCase(fetchAvancedModeConfigThunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = LazyStatus.Error
      })
      .addCase(fetchAvancedModeConfigThunk.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.status = LazyStatus.Loading
      })
  }
})
