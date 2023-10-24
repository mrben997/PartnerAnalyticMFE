import { customConnect } from '../../hocs'
import { fetchAnalyticThunk } from './AnalyticThunk'
import { TStateRedux, TDispatchRedux, RootState, AppDispatch } from '../../type'
import Analytic from '../../../views/Analytic'
import { IAnalyticStateRedux } from './AnalyticSlice'

export interface AnalyticReduxState extends TStateRedux {
  AnalyticSlice: IAnalyticStateRedux
}

export interface AnalyticReduxDispatch extends TDispatchRedux {}

const mapStateToProps = (state: RootState): AnalyticReduxState => ({
  status: state.AnalyticSlice.status,
  AnalyticSlice: state.AnalyticSlice
})

const appDispatchToProps = (dispatch: AppDispatch): AnalyticReduxDispatch => ({
  FetchData: () => {
    return dispatch(fetchAnalyticThunk())
  }
})

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const AnalyticRedux = customConnect<any, AnalyticReduxState, AnalyticReduxDispatch>(
  Analytic,
  mapStateToProps,
  appDispatchToProps
)
export default AnalyticRedux
