/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component, PropsWithChildren, ReactElement, Ref, forwardRef } from 'react'
import { Dialog, Grow, styled } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'

const Transition = forwardRef(function Transition(props: TransitionProps & { children: ReactElement }, ref: Ref<unknown>) {
  return <Grow ref={ref} {...props} timeout={350} />
})

type TProps = PropsWithChildren<{
  id?: string
  open: boolean
  onClose?: (event?: any, reason?: 'backdropClick' | 'escapeKeyDown') => void
}>
export default class DialogBase extends Component<TProps> {
  render() {
    return (
      <CustomDialog
        fullScreen
        onClose={this.props.onClose}
        aria-labelledby={this.props.id}
        open={this.props.open}
        TransitionComponent={Transition}
      >
        {this.props.children}
      </CustomDialog>
    )
  }
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': { padding: theme.spacing(1) },
  '& .MuiDialogActions-root': { padding: theme.spacing(1) }
}))
