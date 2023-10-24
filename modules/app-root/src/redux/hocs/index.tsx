/* eslint-disable @typescript-eslint/no-explicit-any, import/no-named-as-default-member */
import React, { Component, ComponentType } from 'react'
import { connect, ConnectedComponent } from 'react-redux'
import axios, { CancelTokenSource } from 'axios'
import { AppDispatch, LazyStatus } from '../type'
import { ActionMapDispatchToProps, ActionMapStateToProps, IReturnDispatch, TDispatchRedux, TStateRedux } from '../type'
import LazySpinner from './LazySpinner'
import { Box, Fade } from '@mui/material'

interface hocComponentProp<TActionParam> {
  params?: TActionParam
}

interface OptionsHocLazy<TActionParam> {
  params?: TActionParam
}
export const customConnect = function <
  TActionParam,
  TMapState extends TStateRedux,
  TMapDispatch extends TDispatchRedux<TActionParam> = TDispatchRedux<TActionParam>,
  TComponentProps = any
>(
  WrappedComponent: ComponentType<TComponentProps>,
  actionState: ActionMapStateToProps<TMapState> | null = null,
  actionProp: ActionMapDispatchToProps<TMapDispatch> | null = null,
  options: OptionsHocLazy<TActionParam> | null = null
) {
  type TProps = hocComponentProp<TActionParam> & TMapState & TMapDispatch & TComponentProps
  class HocComponent extends Component<TProps> {
    constructor(props: any) {
      super(props)
      this.state = {
        Status: LazyStatus.Loading
      }
    }

    componentDidMount = () => {
      const param = Object.assign({}, this.props.params ?? {}, options?.params ?? {})
      this.TokenSources = axios.CancelToken.source()
      this.DispatchReturn = this.props.FetchData ? this.props.FetchData(param, this.TokenSources.token) : undefined
    }

    TokenSources?: CancelTokenSource
    DispatchReturn?: IReturnDispatch
    componentWillUnmount() {
      this.TokenSources?.cancel('Cancel')
      this.DispatchReturn?.abort()
    }

    render = () => {
      return this.renderContent()
    }

    isFirst: boolean = true
    renderContent = () => {
      if (this.isFirst) {
        this.isFirst = false
        return <LazySpinner in />
      }
      switch (this.props.status) {
        case LazyStatus.Loading:
          return <LazySpinner in />
        case LazyStatus.Loaded:
          return (
            <Fade in>
              <Box width='100%'>
                <WrappedComponent {...this.props} />
              </Box>
            </Fade>
          )
        case LazyStatus.Error:
          return <div>Error...</div>
        default:
          return <div></div>
      }
    }
  }

  const customActionProps = (dispatch: AppDispatch) => {
    return { ...(actionProp ? actionProp(dispatch) : {}) }
  }

  return connect(actionState, customActionProps)(HocComponent as any) as ConnectedComponent<
    ComponentType<TComponentProps>,
    TComponentProps
  >
}
