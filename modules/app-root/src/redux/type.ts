/* eslint-disable @typescript-eslint/no-explicit-any */
import { CancelToken } from 'axios'
import { NetworkReduxState, NetworkReduxDispatch } from './maps/NetworkMenuRedux'
import { AnalyticReduxDispatch, AnalyticReduxState } from './analytic/AnalyticRedux'
import store from './index'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export enum LazyStatus {
  Loading = 'Loading',
  Loaded = 'Loaded',
  Error = 'Error'
}

export interface TStateRedux {
  Status: LazyStatus
  requestId?: string
}

export interface IReturnDispatch {
  abort: () => void
}
type FetchAction<TParam> = (p: TParam, token?: CancelToken) => IReturnDispatch
export interface TDispatchRedux<TParam = any> {
  FetchData?: FetchAction<Partial<TParam>>
}

export type ActionMapStateToProps<TState> = (state: RootState) => TState
export type ActionMapDispatchToProps<TProp> = (dispatch: AppDispatch, props?: any) => TProp

// Outside
export interface AnalyticReduxProps extends AnalyticReduxState, AnalyticReduxDispatch {}
export interface NetworkReduxProps extends NetworkReduxState, NetworkReduxDispatch {}
