import { Dictionary } from '@reduxjs/toolkit'
import { IDataInfo } from '../../../models'
import { ISelectMenu } from '../../../components/type'
import { LazyStatus, TDispatchRedux, TStateRedux } from '../../../redux'

export interface IAnalyticSliceState extends TStateRedux {
  chartStatus: LazyStatus
  networks: ISelectMenu[]
  networkIndex: number
  dateIndex: number
  totals: (string | number)[]
  data: (string | number)[][]
  videos: (string | number)[][]
  channels: (string | number)[][]
  videoInfos: Dictionary<IDataInfo>
  channelInfos: Dictionary<IDataInfo>
}

export interface IAnalyticReduxState extends TStateRedux {
  AnalyticSlice: IAnalyticSliceState
}

export interface IAnalyticReduxDispatch extends TDispatchRedux {
  fetchChartData: () => { abort: () => void }
  setNetworkIndex: (params: number) => void
  setDateIndex: (params: number) => void
}

export interface AnalyticReduxProps extends IAnalyticReduxState, IAnalyticReduxDispatch {}
