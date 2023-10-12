import React, { Component } from 'react'
import { Box, Button } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import { GlobalModalContext, IGlobalModalContext } from '../GlobalModal'
import { ITableTemplateState, TableTemplateContext } from './TableTemplateContext'

interface CRUDPannelProps {
  Create?: JSX.Element
  Edit?: JSX.Element
  Details?: JSX.Element
  Delete?: JSX.Element
}

export class CRUDPannel extends Component<CRUDPannelProps> {
  constructor(props: any) {
    super(props)
  }

  IsMultiple = (state: ITableTemplateState) => {
    return (state.selectionIds?.length ?? 0) > 1
  }

  IsDisplayAction = (state: ITableTemplateState) => {
    return !!state.selectionIds?.length
  }

  getButtons = function* (that: CRUDPannel, state: ITableTemplateState) {
    if (that.props.Edit)
      yield (
        <Button
          onClick={that.onEdit}
          key={'Edit'}
          sx={{ width: 100, height: 30 }}
          color="info"
          disabled={that.IsMultiple(state)}
          startIcon={<Edit />}
        >
          Edit
        </Button>
      )
    if (that.props.Delete)
      yield (
        <Button onClick={that.onDelete} key={'Delete'} sx={{ width: 100, height: 30 }} color="error" startIcon={<Delete />}>
          Delete
        </Button>
      )
    if (that.props.Details)
      yield (
        <Button
          onClick={that.onDetails}
          key={'Details'}
          sx={{ width: 100, height: 30 }}
          color="inherit"
          disabled={that.IsMultiple(state)}
          startIcon={<AppRegistrationIcon />}
        >
          Details
        </Button>
      )
  }

  onCreate = () => {
    this.ModalContext?.ShowModal({
      ContenModal: () => this.props.Create || <EmptyDiv />,
      sx: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    })
  }

  onEdit = () => {
    this.ModalContext?.ShowModal({
      ContenModal: () => this.props.Edit || <EmptyDiv />,
      sx: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    })
  }

  onDelete = () => {
    this.ModalContext?.ShowModal({
      ContenModal: () => this.props.Delete || <EmptyDiv />,
      sx: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    })
  }

  onDetails = () => {
    this.ModalContext?.ShowModal({
      ContenModal: () => this.props.Details || <EmptyDiv />,
      sx: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    })
  }

  ModalContext?: IGlobalModalContext
  render() {
    return (
      <GlobalModalContext.Consumer>
        {(context) => {
          this.ModalContext = context
          return (
            <TableTemplateContext.Consumer>
              {({ state }) => {
                return (
                  <Box
                    sx={{ height: 50, justifyContent: 'space-between', display: 'flex', padding: '10px', position: 'relative' }}
                  >
                    <Box sx={{ justifyContent: 'space-between', display: 'flex', flex: 1, alignItems: 'center' }}>
                      <Box></Box>
                      {this.props.Create && (
                        <Button
                          onClick={this.onCreate}
                          key={'Create'}
                          sx={{ height: 30 }}
                          variant="contained"
                          startIcon={<Add />}
                        >
                          Create
                        </Button>
                      )}
                    </Box>
                    <Box
                      sx={{
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        display: this.IsDisplayAction(state) ? 'flex' : 'none',
                        flex: 1,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: '#e0e0e0',
                      }}
                    >
                      {Array.from(this.getButtons(this, state))}
                    </Box>
                  </Box>
                )
              }}
            </TableTemplateContext.Consumer>
          )
        }}
      </GlobalModalContext.Consumer>
    )
  }
}
export default CRUDPannel
const EmptyDiv = () => <></>
