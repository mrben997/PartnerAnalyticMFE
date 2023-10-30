import { Dictionary } from '@reduxjs/toolkit'
import { IDataInfo } from '../../../models'
import { ISelectMenu } from '../../../components/SelectMenu'
import { TLineChart } from '../../../utils/LineChartProcessor'
import { LazyStatus, TDispatchRedux, TStateRedux } from '../../../redux'
import { IRowData, TOnChangeCheckboxParams, TRowDataProperty, TSelectedProcessorMaping } from '../../../utils/SelectedProcessor'

export interface IAvancedModeSliceState extends TStateRedux {
  tableStatus: LazyStatus
  lineChartStatus: LazyStatus
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
  info: Dictionary<IDataInfo>
  requestIds: Dictionary<string>
  prevAdvenModeRequestId?: string
}

export interface AvancedModeStateRedux extends TStateRedux {
  AvancedModeSlice: IAvancedModeSliceState
}

export interface AvancedModeDispatchRedux extends TDispatchRedux {
  fetchChartData: () => { abort: () => void }
  setNetworkIndex: (params: number) => void
  setDateIndex: (params: number) => void
  setMetricIndex: (params: number) => void
  setTabIndex: (params: number) => void
  setSearchId: (params: string) => void
  onSelectedTableCheckbox: (params: TOnChangeCheckboxParams) => void
}

export interface AvancedModeReduxProps extends AvancedModeStateRedux, AvancedModeDispatchRedux {}
