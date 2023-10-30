import React, { Component, PropsWithChildren } from 'react'
import { TAvancedModeOpen, TAvancedModeClose } from './AvancedModeContext'
import { AvancedModeContext, IAvancedModeContext } from './AvancedModeContext'
import DialogBase from './subs/DialogBase'
import AvancedModeRedux from './redux/AvancedModeRedux'

interface IProps {}
type TProps = PropsWithChildren<IProps>
interface IState {
  isOpen: boolean
}
export default class AvancedModeDialog extends Component<TProps, IState> implements IAvancedModeContext {
  constructor(props: TProps) {
    super(props)
    this.state = { isOpen: false }
  }

  open: TAvancedModeOpen = () => this.setState({ isOpen: true })

  close: TAvancedModeClose = (_, reason) => reason !== 'backdropClick' && this.setState({ isOpen: false })

  render() {
    return (
      <AvancedModeContext.Provider value={this}>
        {this.props.children}
        <DialogBase open={this.state.isOpen} onClose={this.close}>
          <AvancedModeRedux />
        </DialogBase>
      </AvancedModeContext.Provider>
    )
  }
}
