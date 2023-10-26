import { customConnect } from '../../../redux/hocs'
import { TStateRedux, TDispatchRedux, RootState, AppDispatch } from '../../../redux/type'
import Analytic from '..'
import { AnalyticSlice, IAnalyticStateRedux } from './AnalyticSlice'
import { fetchAnalyticThunk, fetchAnalyticConfigThunk } from './AnalyticThunk'

export interface AnalyticReduxState extends TStateRedux {
  AnalyticSlice: IAnalyticStateRedux
}

export interface AnalyticReduxDispatch extends TDispatchRedux {
  fetchChartData: () => { abort: () => void }
  setNetworkIndex: (params: number) => void
  setDateIndex: (params: number) => void
}

const mapStateToProps = (state: RootState): AnalyticReduxState => ({
  status: state.AnalyticSlice.status,
  AnalyticSlice: state.AnalyticSlice
})

const appDispatchToProps = (dispatch: AppDispatch): AnalyticReduxDispatch => ({
  FetchData: () => {
    return dispatch(fetchAnalyticConfigThunk())
  },
  fetchChartData: () => {
    return dispatch(fetchAnalyticThunk())
  },
  setNetworkIndex: (params) => {
    dispatch(AnalyticSlice.actions.setNetworkIndex(params))
    dispatch(fetchAnalyticThunk())
  },
  setDateIndex: (params) => {
    dispatch(AnalyticSlice.actions.setDateIndex(params))
    dispatch(fetchAnalyticThunk())
  }
})

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const AnalyticRedux = customConnect<any, AnalyticReduxState, AnalyticReduxDispatch>(
  Analytic,
  mapStateToProps,
  appDispatchToProps
)
export default AnalyticRedux
