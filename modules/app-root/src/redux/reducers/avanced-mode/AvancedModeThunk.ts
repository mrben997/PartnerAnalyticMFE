import { Graphql } from 'graphql-service-mfe'
import { Dictionary, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from 'OIDC-auth/Components/ApiAuthorization/AuthorizeService'
import { SetupCancel } from '../../helper'
import { IDataInfo, INetwork, TQueryParams } from '../../../utils/type'
import store from '../..'
import DateOption from '../../../utils/DateOption'
import MediaNetworkService from '../../../services/ComponentService'

interface IReturn {}
export const fetchAvancedModeThunk = createAsyncThunk<IReturn>('fetchAvancedModeThunk', async (_, context) => {
  SetupCancel('fetchAvancedModeThunk', context.abort)

  // const state = store.getState().AvancedModeSlice
  // const dateCurrent = DateOption.toStringRequest(DateOption.data[state.dateIndex].value.map((e) => new Date(e)))
  // const networkId = state.networks[state.networkIndex].id

  return {}
})

interface IConfigReturn {
  networks: INetwork[]
}
export const fetchAvancedModeConfigThunk = createAsyncThunk<IConfigReturn>('fetchAvancedModeConfigThunk', async (_, context) => {
  const networkRes = await MediaNetworkService.AllMediaNetwork(context.signal)
  const networks = networkRes.map<INetwork>((e) => ({ id: e.Id, title: e.Name }))
  const roles = await authService.getRoles()
  if (roles?.some((e) => e === 'Admin')) networks.splice(0, 0, { id: '', title: 'All' })
  return { networks }
})
