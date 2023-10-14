import { connect } from 'react-redux'
import { ENetwork } from '../../utils/type'
import { AnalyticSlice } from '../analytic/AnalyticSlice'
import { AppDispatch, RootState } from '../type'
import NetworkMenu from '../../views/NetworkMenu'

export interface NetworkReduxState {
  NetworkSelected: ENetwork
}

export interface NetworkReduxDispatch {
  changeNetworkSelected: (params: ENetwork) => void
}

// ######### Maping #########
const mapStateToProps = (state: RootState): NetworkReduxState => ({
  NetworkSelected: state.AnalyticSlice.networkSelected
})

const appDispatchToProps = (dispatch: AppDispatch): NetworkReduxDispatch => {
  return {
    changeNetworkSelected: (params: ENetwork) => {
      dispatch(AnalyticSlice.actions.changeNetworkSelected(params))
    }
  }
}

const NetworkMenuRedux = connect(mapStateToProps, appDispatchToProps)(NetworkMenu)
export default NetworkMenuRedux
