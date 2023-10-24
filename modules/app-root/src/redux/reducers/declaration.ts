import { AnalyticReduxDispatch, AnalyticReduxState } from './analytic/AnalyticRedux'
import { NetworkReduxDispatch, NetworkReduxState } from './other/NetworkMenuRedux'
import { DateMenuReduxDispatch, DateMenuReduxState } from './other/DateMenuRedux'

export { AnalyticRedux } from './analytic/AnalyticRedux'
export interface AnalyticReduxProps extends AnalyticReduxState, AnalyticReduxDispatch {}

export { NetworkMenuRedux } from './other/NetworkMenuRedux'
export interface NetworkMenuReduxProps extends NetworkReduxState, NetworkReduxDispatch {}

export { DateMenuRedux } from './other/DateMenuRedux'
export interface DateMenuReduxProps extends DateMenuReduxState, DateMenuReduxDispatch {}
