import { customConnect } from '../../../redux/hocs'
import { AvancedModeSlice } from './AvancedModeSlice'
import { RootState, AppDispatch } from '../../../redux/type'
import { AvancedModeDispatchRedux, AvancedModeStateRedux } from './type'
import { fetchAvancedModeThunk, fetchAvancedModeConfigThunk } from './AvancedModeThunk'
import AvancedModeBase from '../AvancedModeBase'

const mapStateToProps = (state: RootState): AvancedModeStateRedux => ({
  status: state.AvancedModeSlice.status,
  AvancedModeSlice: state.AvancedModeSlice
})

const appDispatchToProps = (dispatch: AppDispatch): AvancedModeDispatchRedux => ({
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
  },
  setSearchId: (params) => {
    dispatch(AvancedModeSlice.actions.setSearchId(params))
    dispatch(fetchAvancedModeThunk())
  },
  onSelectedTableCheckbox: (params) => {
    dispatch(AvancedModeSlice.actions.onSelectedTableCheckbox(params))
  }
})

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const AvancedModeRedux = customConnect<any, AvancedModeStateRedux, AvancedModeDispatchRedux>(
  AvancedModeBase,
  mapStateToProps,
  appDispatchToProps
)
export default AvancedModeRedux
