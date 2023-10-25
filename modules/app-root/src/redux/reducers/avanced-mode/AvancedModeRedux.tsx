import { customConnect } from '../../hocs'
import { TStateRedux, TDispatchRedux, RootState, AppDispatch } from '../../type'
import { AvancedModeSlice, IAvancedModeStateRedux } from './AvancedModeSlice'
import { fetchAvancedModeThunk, fetchAvancedModeConfigThunk } from './AvancedModeThunk'
import AvancedModeBase from '../../../views/AvancedMode/AvancedModeBase'

export interface AvancedModeReduxState extends TStateRedux {
  AvancedModeSlice: IAvancedModeStateRedux
}

export interface AvancedModeReduxDispatch extends TDispatchRedux {
  fetchChartData: () => { abort: () => void }
  setNetworkIndex: (params: number) => void
  setDateIndex: (params: number) => void
  setMetricIndex: (params: number) => void
  setTabIndex: (params: number) => void
}

const mapStateToProps = (state: RootState): AvancedModeReduxState => ({
  status: state.AvancedModeSlice.status,
  AvancedModeSlice: state.AvancedModeSlice
})

const appDispatchToProps = (dispatch: AppDispatch): AvancedModeReduxDispatch => ({
  FetchData: () => {
    return dispatch(fetchAvancedModeConfigThunk())
  },
  fetchChartData: () => {
    return dispatch(fetchAvancedModeThunk())
  },
  setNetworkIndex: (params) => {
    dispatch(AvancedModeSlice.actions.setNetworkIndex(params))
    dispatch(fetchAvancedModeThunk())
  },
  setDateIndex: (params) => {
    dispatch(AvancedModeSlice.actions.setDateIndex(params))
    dispatch(fetchAvancedModeThunk())
  },
  setMetricIndex: (params) => {
    dispatch(AvancedModeSlice.actions.setMetricIndex(params))
    dispatch(fetchAvancedModeThunk())
  },
  setTabIndex: (params) => {
    dispatch(AvancedModeSlice.actions.setTabIndex(params))
    dispatch(fetchAvancedModeThunk())
  }
})

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const AvancedModeRedux = customConnect<any, AvancedModeReduxState, AvancedModeReduxDispatch>(
  AvancedModeBase,
  mapStateToProps,
  appDispatchToProps
)
export default AvancedModeRedux
