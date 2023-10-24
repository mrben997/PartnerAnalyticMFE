import { AnalyticReduxDispatch, AnalyticReduxState } from './Analytic/AnalyticRedux'
import { DateMenuReduxDispatch, DateMenuReduxState } from './DateMenu/DateMenuRedux'
import { NetworkReduxDispatch, NetworkReduxState } from './NetworkMenu/NetworkMenuRedux'

export { AnalyticRedux } from './Analytic/AnalyticRedux'
export interface AnalyticReduxProps extends AnalyticReduxState, AnalyticReduxDispatch {}

export { NetworkMenuRedux } from './NetworkMenu/NetworkMenuRedux'
export interface NetworkMenuReduxProps extends NetworkReduxState, NetworkReduxDispatch {}

export { DateMenuRedux } from './DateMenu/DateMenuRedux'
export interface DateMenuReduxProps extends DateMenuReduxState, DateMenuReduxDispatch {}
