import { customConnect } from '../hocs'
import { fetchAnalyticThunk } from './AnalyticThunk'
import { IAnalyticStateRedux } from './AnalyticSlice'
import { AppDispatch, RootState, TDispatchRedux, TStateRedux } from '../type'
import Analytic from '../../views/Analytic'

export interface AnalyticReduxState extends TStateRedux {
  AnalyticSlice: IAnalyticStateRedux
}

export interface AnalyticReduxDispatch extends TDispatchRedux {}

// ######### Maping #########
const mapStateToProps = (state: RootState): AnalyticReduxState => ({
  Status: state.AnalyticSlice.Status,
  AnalyticSlice: state.AnalyticSlice
})

const appDispatchToProps = (dispatch: AppDispatch): AnalyticReduxDispatch => {
  return {
    FetchData: () => {
      return dispatch(fetchAnalyticThunk())
    }
  }
}

// ######### Export section #########
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const AnalyticRedux = customConnect<any, AnalyticReduxState, AnalyticReduxDispatch>(
  Analytic,
  mapStateToProps,
  appDispatchToProps
)
export default AnalyticRedux
