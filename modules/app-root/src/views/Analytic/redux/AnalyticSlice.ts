import { Dictionary, EntityState, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { fetchAnalyticConfigThunk, fetchAnalyticThunk } from './AnalyticThunk'
import { IDataInfo, IDateOption, INetwork, ITopData, TQueryParams } from '../../../models'
import { LazyStatus, TStateRedux } from '../../../redux/type'
import FakeDataLocal from '../../../utils/FakeDataLocal'
import DateOption from '../../../utils/DateOption'

export interface IAnalyticState {
  networks: INetwork[]
  networkIndex: number
  dateIndex: number
  totals: (string | number)[]
  data: (string | number)[][]
  videos: (string | number)[][]
  channels: (string | number)[][]
  videoInfos: Dictionary<IDataInfo>
  channelInfos: Dictionary<IDataInfo>
}

export interface IAnalyticStateRedux extends TStateRedux, IAnalyticState {
  chartStatus: LazyStatus
}

// Define the initial state using that type
const initialState: IAnalyticStateRedux = {
  status: LazyStatus.Loading,
  chartStatus: LazyStatus.Loading,
  networks: [],
  totals: ['', '0', '0', '0'],
  data: [],
  dateIndex: 0,
  networkIndex: 0,
  videoInfos: {},
  channelInfos: {},
  videos: [],
  channels: []
}

export const AnalyticSlice = createSlice({
  name: 'AnalyticSlice',
  initialState,
  reducers: {
    setNetworkIndex: (state, action: PayloadAction<number>) => {
      state.networkIndex = action.payload
    },
    setDateIndex: (state, action: PayloadAction<number>) => {
      state.dateIndex = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticThunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.chartStatus = LazyStatus.Loaded
        state.totals = action.payload.totals
        state.data = action.payload.data
        state.videos = action.payload.videos
        state.channels = action.payload.channels
        state.videoInfos = action.payload.videoInfos
        state.channelInfos = action.payload.channelInfos
      })
      .addCase(fetchAnalyticThunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.chartStatus = LazyStatus.Error
      })
      .addCase(fetchAnalyticThunk.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.chartStatus = LazyStatus.Loading
      })

    builder
      .addCase(fetchAnalyticConfigThunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = LazyStatus.Loaded

        state.networks = action.payload.networks
      })
      .addCase(fetchAnalyticConfigThunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = LazyStatus.Error
      })
      .addCase(fetchAnalyticConfigThunk.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.status = LazyStatus.Loading
      })
  }
})
