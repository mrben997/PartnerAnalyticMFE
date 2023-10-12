import React, { Component } from 'react'
import { Modal, SxProps } from '@mui/material'
import { OptionModal } from './type'
import { GlobalModalContext, IGlobalModalContext } from './GlobalModalContext'

export * from './type'
export * from './GlobalModalContext'

interface GlobalModalState {
  ContenModal?: React.JSXElementConstructor<any>
  sx?: SxProps
}
type TProps = React.PropsWithChildren<{}>
export default class GlobalModal extends Component<TProps, GlobalModalState> implements IGlobalModalContext {
  constructor(props: any) {
    super(props)
    this.state = {}
  }
  ShowModal = (option: OptionModal) => {
    this.setState({ ContenModal: option.ContenModal, sx: option.sx })
  }
  CloseModal = () => {
    this.setState({ ContenModal: undefined })
  }
  GenerateContent = (): JSX.Element => {
    const Content = this.state.ContenModal ?? (() => <></>)
    const Temp = React.forwardRef(() => <Content />)
    return <Temp />
  }
  render() {
    return (
      <GlobalModalContext.Provider value={this}>
        {this.props.children}
        <Modal
          // hideBackdrop
          open={!!this.state.ContenModal}
          // onClose={handleClose}
          sx={this.state.sx}
        >
          {this.GenerateContent()}
        </Modal>
      </GlobalModalContext.Provider>
    )
  }
}
