import { AnalyticReduxDispatch, AnalyticReduxState } from './analytic/AnalyticRedux'
import { AvancedModeReduxDispatch, AvancedModeReduxState } from './avanced-mode/AvancedModeRedux'

export { AnalyticRedux } from './analytic/AnalyticRedux'
export interface AnalyticReduxProps extends AnalyticReduxState, AnalyticReduxDispatch {}

export { AvancedModeRedux } from './avanced-mode/AvancedModeRedux'
export interface AvancedModeReduxProps extends AvancedModeReduxState, AvancedModeReduxDispatch {}
