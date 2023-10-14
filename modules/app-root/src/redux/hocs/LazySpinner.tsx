import React, { Component, PropsWithChildren } from 'react'
import { Box, CircularProgress, Fade, styled } from '@mui/material'

type TProps = PropsWithChildren<{
  in?: boolean
}>
export default class LazySpinner extends Component<TProps> {
  render() {
    return (
      <>
        {this.props.children}
        <Fade in={this.props.in} unmountOnExit timeout={{ enter: 0, exit: 350 }}>
          <ContainerSpinner>
            <CircularProgress />
          </ContainerSpinner>
        </Fade>
      </>
    )
  }
}

const ContainerSpinner = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff'
})
