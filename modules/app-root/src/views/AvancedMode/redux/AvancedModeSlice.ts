import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { store } from '../../../redux'
import { IAvancedModeSliceState } from './type'
import { LazyStatus } from '../../../redux/type'
import { TOnChangeCheckboxParams } from '../../../utils/SelectedProcessor/type'
import { fetchAvancedModeConfigThunk, fetchAvancedModeThunk, fetchLineChartThunk } from './AvancedModeThunk'
import SelectedProcessor from '../../../utils/SelectedProcessor'

// Define the initial state using that type
const initialState: IAvancedModeSliceState = {
  status: LazyStatus.Loading,
  tableStatus: LazyStatus.Loading,
  lineChartStatus: LazyStatus.Loading,
  dateIndex: 1,
  networks: [],
  networkIndex: 0,
  metricIndex: 0,
  tabIndex: 0,
  tableData: [],
  lineChart: {},
  tableDataMaping: {},
  tableDataMapingDefault: {},
  dates: [],
  searchId: '',
  info: {},
  requestIds: {}
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
        if (state.requestIds['fetchAvancedModeThunk'] !== action.meta.requestId) return
        state.tableStatus = LazyStatus.Loaded

        state.tableData = action.payload.tableData
        state.tableDataMaping = SelectedProcessor.convertMaping(action.payload.tableData)
        const rowDefaults = action.payload.tableData.slice(1, 6)
        state.tableDataMapingDefault = SelectedProcessor.convertMapingUnusedColor(rowDefaults)
        setTimeout(() => {
          store.dispatch(fetchLineChartThunk())
        }, 100)
      })
      .addCase(fetchAvancedModeThunk.rejected, (state, action) => {
        if (state.requestIds['fetchAvancedModeThunk'] !== action.meta.requestId) return
        state.tableStatus = LazyStatus.Error
      })
      .addCase(fetchAvancedModeThunk.pending, (state, action) => {
        state.requestIds['fetchAvancedModeThunk'] = action.meta.requestId
        state.tableStatus = LazyStatus.Loading
        state.lineChartStatus = LazyStatus.Loading
      })

    builder
      .addCase(fetchLineChartThunk.fulfilled, (state, action) => {
        if (
          state.requestIds['fetchLineChartThunk'] !== action.meta.requestId ||
          state.prevAdvenModeRequestId !== state.requestIds['fetchAvancedModeThunk']
        )
          return
        state.lineChartStatus = LazyStatus.Loaded
        state.lineChart = action.payload.lineChart
        state.dates = action.payload.dates
        state.info = action.payload.info
      })
      .addCase(fetchLineChartThunk.rejected, (state, action) => {
        if (
          state.requestIds['fetchLineChartThunk'] !== action.meta.requestId ||
          state.prevAdvenModeRequestId !== state.requestIds['fetchAvancedModeThunk']
        )
          return
        state.lineChartStatus = LazyStatus.Error
      })
      .addCase(fetchLineChartThunk.pending, (state, action) => {
        state.requestIds['fetchLineChartThunk'] = action.meta.requestId
        state.prevAdvenModeRequestId = state.requestIds['fetchAvancedModeThunk']
        state.lineChartStatus = LazyStatus.Loading
      })

    builder
      .addCase(fetchAvancedModeConfigThunk.fulfilled, (state, action) => {
        if (state.requestIds['fetchAvancedModeConfigThunk'] !== action.meta.requestId) return
        state.status = LazyStatus.Loaded

        state.networks = action.payload.networks
      })
      .addCase(fetchAvancedModeConfigThunk.rejected, (state, action) => {
        if (state.requestIds['fetchAvancedModeConfigThunk'] !== action.meta.requestId) return
        state.status = LazyStatus.Error
      })
      .addCase(fetchAvancedModeConfigThunk.pending, (state, action) => {
        state.requestIds['fetchAvancedModeConfigThunk'] = action.meta.requestId
        state.status = LazyStatus.Loading
      })
  }
})
