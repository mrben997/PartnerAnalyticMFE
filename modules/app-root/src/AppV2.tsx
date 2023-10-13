import React, { Component } from 'react'
import { Container } from '@mui/material'
import { Dictionary } from '@reduxjs/toolkit'
import TableContent, { TableContentHelper } from './TableContent'
import { IMapSelected, IMapSelecteds, IRowData, TOnChangeCheckbox, TOnChangeCheckboxAll } from './TableContent/type'
import FAKEDATA from './core/FAKEDATA'

interface IProps {}
interface IState {
  data: IRowData[]
  mapSelects: IMapSelecteds
}

export default class AppV2 extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = this.initial()
  }

  initial = (): IState => {
    const { colors, calculatorTotals, inititalMap } = TableContentHelper
    const data = calculatorTotals(FAKEDATA.rowDatas, FAKEDATA.initialRowData('Total'))
    console.log(data)

    const mapSelect = inititalMap(data)
    console.log(mapSelect)
    return { data, mapSelects: { colors, max: colors.length, map: mapSelect } }
  }

  handleChangeCheckbox: TOnChangeCheckbox = (params) => {
    switch (params.type) {
      case 'unit': {
        const mapSelects = TableContentHelper.selectUnitCheckbox(this.state.mapSelects, params.value.id, params.checked)
        this.setState({ mapSelects })
        return
      }
      case 'all': {
        const mapSelects = TableContentHelper.selectAllCheckbox(this.state.mapSelects, params.checked)
        this.setState({ mapSelects })
        return
      }
      default:
        break
    }
  }

  render() {
    return (
      <Container>
        <TableContent data={this.state.data} onChangeCheckbox={this.handleChangeCheckbox} mapSelecteds={this.state.mapSelects} />
      </Container>
    )
  }
}
