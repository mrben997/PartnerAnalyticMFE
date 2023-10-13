import React, { Component } from 'react'
import { Container } from '@mui/material'
import TableContent from './components/TableContent'
import { colors, convertMapSelectToColors, generateRowData, getUnusedColor } from './components/TableContent/helper'
import { IMapSelected, IMapSelecteds, IRowData, TOnChangeCheckbox } from './components/TableContent/type'
import { Dictionary } from '@reduxjs/toolkit'

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
    const data = generateRowData(30)
    const mapSelect = data.reduce((obj, cur): Dictionary<IMapSelected> => {
      const data: IMapSelected = { checked: false }
      obj[cur.id] = data
      return obj
    }, {})
    return { data, mapSelects: { colors, map: mapSelect } }
  }

  disableCheckboxWhenActiveMaxItems = (params: IMapSelecteds): Dictionary<IMapSelected> => {
    const cls = convertMapSelectToColors(params)
    if (cls.length !== this.state.mapSelects.colors.length) {
      return this.state.data.reduce((obj, cur) => {
        const data = this.state.mapSelects.map[cur.id]
        if (data) delete data.disabled
        obj[cur.id] = data
        return obj
      }, {})
    }

    return this.state.data.reduce((obj, cur) => {
      let data = this.state.mapSelects.map[cur.id]
      if (!data?.color) data = { ...data, disabled: true } as IMapSelected
      obj[cur.id] = data
      return obj
    }, {})
  }

  handleSelectTypeUnit: TOnChangeCheckbox = (params) => {
    const newMap = { ...this.state.mapSelects }
    const color = getUnusedColor(params.value.id, this.state.mapSelects)
    newMap.map[params.value.id] = { checked: params.checked, color }
    if (!params.checked) delete newMap.map[params.value.id]?.color
    newMap.map = this.disableCheckboxWhenActiveMaxItems(newMap)
    this.setState({ mapSelects: newMap })
  }

  handleChangeCheckbox: TOnChangeCheckbox = (params) => {
    if (params.type === 'unit') this.handleSelectTypeUnit(params)
    // TODO click by select all
  }

  render() {
    // console.log(this.state)

    return (
      <Container>
        <TableContent data={this.state.data} onChangeCheckbox={this.handleChangeCheckbox} mapSelecteds={this.state.mapSelects} />
      </Container>
    )
  }
}
