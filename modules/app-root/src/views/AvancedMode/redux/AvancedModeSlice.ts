import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ISelectMenu } from '../../../components/type'
import { LazyStatus, TStateRedux } from '../../../redux/type'
import { TLineChart } from '../../../utils/LineChartProcessor'
import { fetchAvancedModeConfigThunk, fetchAvancedModeThunk } from './AvancedModeThunk'
import { IRowData, TOnChangeCheckboxParams, TRowDataProperty } from '../../../utils/SelectedProcessor/type'
import SelectedProcessor, { TSelectedProcessorMaping } from '../../../utils/SelectedProcessor'

export interface IAvancedModeStateRedux extends TStateRedux {
  tableStatus: LazyStatus
  // lineChartStatus: LazyStatus
  networks: ISelectMenu[]
  networkIndex: number
  dateIndex: number
  metricIndex: number
  tabIndex: number
  tableData: IRowData[]
  lineChart: TLineChart
  dates: TRowDataProperty[]
  tableDataMaping: TSelectedProcessorMaping
  tableDataMapingDefault: TSelectedProcessorMaping
  searchId: string
}

// Define the initial state using that type
const initialState: IAvancedModeStateRedux = {
  status: LazyStatus.Loading,
  tableStatus: LazyStatus.Loading,
  // lineChartStatus: LazyStatus.Loading,
  dateIndex: 0,
  networks: [],
  networkIndex: 0,
  metricIndex: 0,
  tabIndex: 0,
  tableData: [],
  lineChart: {},
  tableDataMaping: {},
  tableDataMapingDefault: {},
  dates: [],
  searchId: ''
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
    },
    setSearchId: (state, action: PayloadAction<string>) => {
      state.searchId = action.payload
    },
    onSelectedTableCheckbox: (state, action: PayloadAction<TOnChangeCheckboxParams>) => {
      switch (action.payload.type) {
        case 'unit': {
          const item = action.payload
          state.tableDataMaping = SelectedProcessor.selectUnitCheckbox(
            item.value.id as string,
            item.checked,
            state.tableDataMaping
          )
          return
        }
        case 'all': {
          state.tableDataMaping = SelectedProcessor.selectAllCheckbox(action.payload.checked, state.tableDataMaping)
          return
        }
        default:
          break
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvancedModeThunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.tableStatus = LazyStatus.Loaded

        state.tableData = action.payload.tableData
        state.tableDataMaping = SelectedProcessor.convertMaping(action.payload.tableData)
        const rowDefaults = action.payload.tableData.slice(1, 6)

        state.tableDataMapingDefault = SelectedProcessor.convertMapingUnusedColor(rowDefaults)
        // console.log(state.tableData, state.tableDataMaping)

        state.lineChart = action.payload.lineChart
        state.dates = action.payload.dates
      })
      .addCase(fetchAvancedModeThunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.tableStatus = LazyStatus.Error
      })
      .addCase(fetchAvancedModeThunk.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.tableStatus = LazyStatus.Loading
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
