import React, { Component } from 'react'
import { Container } from '@mui/material'
import { Dictionary } from '@reduxjs/toolkit'
import TableContent, { TableContentHelper } from './TableContent'
import { IMapSelected, IMapSelecteds, IRowData, TOnChangeCheckbox, TOnChangeCheckboxAll } from './TableContent/type'
import FAKEDATA from './core/FAKEDATA'
import SelectAccessor from './TableContent/SelectAccessor'
import { idDefault } from 'csmfe'

interface IProps {}
interface IState {}

export default class AppV2 extends Component<IProps, IState> {
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
      <Container>
        <TableContent data={this.selectAccessor} onChangeCheckbox={this.handleChangeCheckbox} />
      </Container>
    )
  }
}
