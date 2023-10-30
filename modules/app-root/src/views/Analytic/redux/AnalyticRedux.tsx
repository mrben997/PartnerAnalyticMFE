import { AnalyticSlice } from './AnalyticSlice'
import { customConnect } from '../../../redux/hocs'
import { RootState, AppDispatch } from '../../../redux/type'
import { IAnalyticReduxDispatch, IAnalyticReduxState } from './type'
import { fetchAnalyticThunk, fetchAnalyticConfigThunk } from './AnalyticThunk'
import AnalyticBase from '../AnalyticBase'

const mapStateToProps = (state: RootState): IAnalyticReduxState => ({
  status: state.AnalyticSlice.status,
  AnalyticSlice: state.AnalyticSlice
})

const appDispatchToProps = (dispatch: AppDispatch): IAnalyticReduxDispatch => ({
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
export const AnalyticRedux = customConnect<any, IAnalyticReduxState, IAnalyticReduxDispatch>(
  AnalyticBase,
  mapStateToProps,
  appDispatchToProps
)
export default AnalyticRedux
