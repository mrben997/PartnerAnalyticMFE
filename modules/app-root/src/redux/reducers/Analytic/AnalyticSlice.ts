import { EntityState, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { fetchAnalyticThunk } from './AnalyticThunk'
import { IDateOption, INetwork } from '../../../utils/type'
import { LazyStatus, TStateRedux } from '../../type'
import FakeDataLocal from '../../../utils/FakeDataLocal'
import DateOption from '../../../views/DateMenu/DateOption'

export interface IAnalyticState {
  networks: EntityState<INetwork>
  networkId: string
  dates: EntityState<IDateOption>
  dateId: string
}

export interface IAnalyticStateRedux extends TStateRedux, IAnalyticState {}

const NetworkSliceAdapter = createEntityAdapter<INetwork>({ selectId: (x) => x.id })
const DateSliceAdapter = createEntityAdapter<IDateOption>({ selectId: (x) => x.id })

// Define the initial state using that type
const initialState: IAnalyticStateRedux = {
  status: LazyStatus.Loading,
  networks: NetworkSliceAdapter.getInitialState(),
  networkId: '',
  dates: DateSliceAdapter.getInitialState(),
  dateId: ''
}

export const AnalyticSlice = createSlice({
  name: 'AnalyticSlice',
  initialState,
  reducers: {
    setNetworkId: (state, action: PayloadAction<string>) => {
      state.networkId = action.payload
    },
    setDateId: (state, action: PayloadAction<string>) => {
      state.dateId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticThunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = LazyStatus.Loaded

        const { networks } = action.payload
        NetworkSliceAdapter.removeAll(state.networks as EntityState<INetwork>)
        NetworkSliceAdapter.upsertMany(state.networks as EntityState<INetwork>, networks)
        if (networks[0] && networks[0].id) state.networkId = networks[0].id

        const dates = DateOption.data
        DateSliceAdapter.removeAll(state.dates as EntityState<IDateOption>)
        DateSliceAdapter.upsertMany(state.dates as EntityState<IDateOption>, dates)
        if (dates[0] && dates[0].id) state.dateId = dates[0].id
      })
      .addCase(fetchAnalyticThunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = LazyStatus.Error
      })
      .addCase(fetchAnalyticThunk.pending, (state, action) => {
        state.requestId = action.meta.requestId
        state.status = LazyStatus.Loading
      })
  }
})
