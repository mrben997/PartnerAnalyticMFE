import React, { Component } from 'react'
import { Container } from '@mui/material'
import { idDefault } from 'csmfe'
import { TOnChangeCheckbox } from '../TableContent/type'
import TableContent, { SelectAccessor } from '../TableContent'
import FAKEDATA from '../../utils/FAKEDATA'

interface IProps {}
interface IState {}

export default class AvancedModeTable extends Component<IProps, IState> {
  selectAccessor: SelectAccessor
  constructor(props: IProps) {
    super(props)
    const sa = new SelectAccessor(FAKEDATA.rowDatas, idDefault)
    this.selectAccessor = sa
  }

  handleChangeCheckbox: TOnChangeCheckbox = (params) => {
    switch (params.type) {
      case 'unit': {
        this.selectAccessor.selectUnitCheckbox(params.value.id, params.checked)
        this.forceUpdate()
        return
      }
      case 'all': {
        this.selectAccessor.selectAllCheckbox(params.checked)
        this.forceUpdate()
        return
      }
      default:
        break
    }
  }

  render() {
    return (
      <Container maxWidth={false}>
        <TableContent data={this.selectAccessor} onChangeCheckbox={this.handleChangeCheckbox} />
      </Container>
    )
  }
}
