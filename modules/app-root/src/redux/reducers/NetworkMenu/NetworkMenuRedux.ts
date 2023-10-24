import { connect } from 'react-redux'
import { EntityState } from '@reduxjs/toolkit'
import { AnalyticSlice } from '../Analytic/AnalyticSlice'
import { INetwork } from '../../../utils/type'
import { AppDispatch, RootState } from '../../type'
import NetworkMenu from '../../../views/NetworkMenu'

export interface NetworkReduxState {
  networks: EntityState<INetwork>
  networkId: string
}

export interface NetworkReduxDispatch {
  setNetworkId: (params: string) => void
}

const mapStateToProps = (state: RootState): NetworkReduxState => ({
  networks: state.AnalyticSlice.networks,
  networkId: state.AnalyticSlice.networkId
})

const appDispatchToProps = (dispatch: AppDispatch): NetworkReduxDispatch => ({
  setNetworkId: (params: string) => {
    dispatch(AnalyticSlice.actions.setNetworkId(params))
  }
})

export const NetworkMenuRedux = connect(mapStateToProps, appDispatchToProps)(NetworkMenu)
export default NetworkMenuRedux
