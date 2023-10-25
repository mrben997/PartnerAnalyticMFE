import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { LazyStatus, TStateRedux } from '../../type'
import { fetchAvancedModeConfigThunk, fetchAvancedModeThunk } from './AvancedModeThunk'
import { IRowData } from '../../../utils/type'
import { ISelectMenu } from '../../../components/type'

export interface IAvancedModeStateRedux extends TStateRedux {
  fetchStatus: LazyStatus
  networks: ISelectMenu[]
  networkIndex: number
  dateIndex: number
  metricIndex: number
  tabIndex: number
  tableData: IRowData[]
}

// Define the initial state using that type
const initialState: IAvancedModeStateRedux = {
  status: LazyStatus.Loading,
  fetchStatus: LazyStatus.Loading,
  dateIndex: 0,
  networks: [],
  networkIndex: 0,
  metricIndex: 0,
  tabIndex: 0,
  tableData: []
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
    },
    setTabIndex: (state, action: PayloadAction<number>) => {
      state.tabIndex = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvancedModeThunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.fetchStatus = LazyStatus.Loaded
        state.tableData = action.payload.tableData
      })
      .addCase(fetchAvancedModeThunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.fetchStatus = LazyStatus.Error
      })
      .addCase(fetchAvancedModeThunk.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.fetchStatus = LazyStatus.Loading
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
