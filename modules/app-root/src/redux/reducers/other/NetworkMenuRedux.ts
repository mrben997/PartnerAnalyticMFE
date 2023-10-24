import { connect } from 'react-redux'
import { EntityState } from '@reduxjs/toolkit'
import { AnalyticSlice } from '../analytic/AnalyticSlice'
import { INetwork } from '../../../utils/type'
import { AppDispatch, RootState } from '../../type'
import NetworkMenu from '../../../views/NetworkMenu'

export interface NetworkReduxState {
  networks: INetwork[]
  networkIndex: number
}

export interface NetworkReduxDispatch {
  setNetworkId: (params: number) => void
}

const mapStateToProps = (state: RootState): NetworkReduxState => ({
  networks: state.AnalyticSlice.networks,
  networkIndex: state.AnalyticSlice.networkIndex
})

const appDispatchToProps = (dispatch: AppDispatch): NetworkReduxDispatch => ({
  setNetworkId: (params) => {
    dispatch(AnalyticSlice.actions.setNetworkId(params))
  }
})

export const NetworkMenuRedux = connect(mapStateToProps, appDispatchToProps)(NetworkMenu)
export default NetworkMenuRedux
