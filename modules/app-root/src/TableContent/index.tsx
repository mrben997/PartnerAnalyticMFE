import React, { Component } from 'react'
import { idDefault } from 'csmfe'
import { Checkbox, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from '@mui/material'
import { IMapSelected, IMapSelecteds, IRowData, TOnChangeCheckbox, TOnChangeCheckboxAll } from './type'
import TableContentHelper from './helper'

export * from './helper'

interface IProps {
  data: IRowData[]
  mapSelecteds: IMapSelecteds
  onChangeCheckbox?: TOnChangeCheckbox
}

export default class TableContent extends Component<IProps> {
  getCheckboxControlStatus = () => {
    const ids = TableContentHelper.convertMapSelectToSelectedIds(this.props.mapSelecteds)
    const checked = ids.length === this.props.mapSelecteds.max
    const indeterminate = ids.length > 0 && ids.length < this.props.mapSelecteds.max
    return { checked, indeterminate }
  }

  handleChangeCheckbox: TOnChangeCheckbox = (params) => {
    if (!this.props.onChangeCheckbox) return
    this.props.onChangeCheckbox(params)
  }

  handleChangeCheckBoxAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!this.props.onChangeCheckbox) return
    this.props.onChangeCheckbox({ type: 'all', checked: event.target.checked })
  }

  render() {
    return (
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {this.renderHeader()}
          <TableBody>
            {this.props.data.map((row) => {
              const status = this.props.mapSelecteds.map[row.id]
              return this.renderRow(row, status)
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  renderHeader = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell padding='none' width='42px'>
            <Checkbox {...this.getCheckboxControlStatus()} onChange={this.handleChangeCheckBoxAll} />
          </TableCell>
          <TableCell></TableCell>
          <TableCell>Views</TableCell>
          <TableCell>Watch time (hours)</TableCell>
          <TableCell>Estimated partner revenue</TableCell>
        </TableRow>
      </TableHead>
    )
  }

  renderRow = (row: IRowData, status?: IMapSelected) => {
    const check = row.id === idDefault
    const sx: SxProps<Theme> = check ? { '& .MuiTableCell-root': { fontWeight: 700 } } : {}
    const color = status?.color ?? '#606060'
    return (
      <TableRow key={row.title} sx={{ '&:last-child td, &:last-child th': { border: 0 }, ...sx }}>
        <TableCell padding='none'>
          <Checkbox
            checked={status?.checked}
            disabled={status?.disabled}
            sx={{ color, '&.Mui-checked': { color } }}
            onChange={(_, checked) => this.handleChangeCheckbox({ type: 'unit', checked, value: row })}
          />
        </TableCell>
        <TableCell scope='row'>
          {row.id} - {row.title}
        </TableCell>
        <TableCell>{row.views}</TableCell>
        <TableCell>{row.estimatedMinutesWatched}</TableCell>
        <TableCell>{row.estimatedRevenue}</TableCell>
      </TableRow>
    )
  }
}
