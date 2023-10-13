import React, { Component } from 'react'
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { faker } from '@faker-js/faker'
import { colors, getUnusedColor } from './helper'
import { Dictionary } from '@reduxjs/toolkit'
import { IMapSelecteds, IRowData, TOnChangeCheckbox } from './type'

interface IProps {
  data: IRowData[]
  mapSelecteds: IMapSelecteds
  onChangeCheckbox?: TOnChangeCheckbox
}

export default class TableContent extends Component<IProps> {
  handleChangeCheckbox: TOnChangeCheckbox = (params) => {
    if (!this.props.onChangeCheckbox) return
    this.props.onChangeCheckbox(params)
  }

  render() {
    return (
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {this.renderHeader()}
          {this.renderBody()}
        </Table>
      </TableContainer>
    )
  }

  renderHeader = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell padding='none' width='42px'>
            {/* <Checkbox
              sx={{ color, '&.Mui-checked': { color } }}
              onChange={(_, checked) => this.handleChangeCheckbox({ type: 'unit', checked, value: row })}
            /> */}
          </TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Views</TableCell>
          <TableCell>Watch time (hours)</TableCell>
          <TableCell>Estimated partner revenue</TableCell>
        </TableRow>
      </TableHead>
    )
  }

  renderBody = () => {
    return (
      <TableBody>
        {this.props.data.map((row) => {
          const elm = this.props.mapSelecteds.map[row.id]
          const color = elm?.color ?? '#606060'
          return (
            <TableRow key={row.title} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell padding='none'>
                <Checkbox
                  checked={elm?.checked}
                  disabled={elm?.disabled}
                  sx={{ color, '&.Mui-checked': { color } }}
                  onChange={(_, checked) => this.handleChangeCheckbox({ type: 'unit', checked, value: row })}
                />
              </TableCell>
              <TableCell scope='row'>{row.title}</TableCell>
              <TableCell>{row.views}</TableCell>
              <TableCell>{row.estimatedMinutesWatched}</TableCell>
              <TableCell>{row.estimatedRevenue}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    )
  }
}
