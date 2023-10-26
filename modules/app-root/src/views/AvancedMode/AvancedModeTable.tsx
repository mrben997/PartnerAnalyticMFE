import React, { Component } from 'react'
import { Dictionary } from '@reduxjs/toolkit'
import { formatterUSD, humanNumber } from 'csmfe/helper'
import { Container, Link, TableContainer, TableSortLabel, Typography, styled } from '@mui/material'
import { Checkbox, SxProps, Table, TableBody, TableCell, TableHead, TableRow, Theme } from '@mui/material'
import SelectedProcessor, { TSelectedProcessorMaping } from '../../utils/SelectedProcessor'
import { IDataInfo } from '../../models'
import { IRowData, TOnChangeCheckbox } from '../../utils/SelectedProcessor/type'

interface IProps {
  info: Dictionary<IDataInfo>
  tableData: IRowData[]
  tableDataMaping: TSelectedProcessorMaping
  tableDataMapingDefault: TSelectedProcessorMaping
  metricIndex: number
  baseUrl: string
  onChangeCheckbox: TOnChangeCheckbox
}
interface IState {}

export default class AvancedModeTable extends Component<IProps, IState> {
  getCheckboxControlStatus = () => {
    const ids = SelectedProcessor.getIdActives(this.props.tableDataMaping)
    const checked = ids.length === SelectedProcessor.max
    const indeterminate = ids.length > 0 && ids.length < SelectedProcessor.max
    return { checked, indeterminate }
  }

  getSxDefault = (row: IRowData): { borderLeftColor?: string; color?: string } => {
    const ids = SelectedProcessor.getIdActives(this.props.tableDataMaping)
    const rowDefault = this.props.tableDataMapingDefault[row.id]
    return rowDefault && ids.length < 1 ? { borderLeftColor: rowDefault.color, color: rowDefault.color } : {}
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
      <Container maxWidth={false} sx={{ minHeight: '20rem', mt: '24px' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            {this.renderHeader()}
            <TableBody>{this.props.tableData.map((row) => this.renderRow(row))}</TableBody>
          </Table>
        </TableContainer>
      </Container>
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
          <TableCell sortDirection={'desc'} sx={{ fontWeight: 700, color: '#6c6c6c' }}>
            <TableSortLabel active={this.props.metricIndex === 0} direction='desc'>
              Views
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ fontWeight: 700, color: '#6c6c6c' }}>
            <TableSortLabel active={this.props.metricIndex === 1} direction='desc'>
              Watch time (hours)
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ fontWeight: 700, color: '#6c6c6c' }}>
            <TableSortLabel active={this.props.metricIndex === 2} direction='desc'>
              Estimated partner revenue
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
    )
  }

  getHref = (id: string | number): string => {
    return this.props.baseUrl + id
  }

  renderRow = (row: IRowData) => {
    // TODO chuyển về component
    const check = SelectedProcessor.isTotalRow(row.id as string)
    const status = this.props.tableDataMaping[row.id]
    const sxDefault = this.getSxDefault(row)
    const color = status?.color ?? sxDefault.color ?? '#606060'
    const sx: SxProps<Theme> = check ? { '& .MuiTableCell-root': { fontWeight: 700 } } : {}

    return (
      <CustomTableRow key={row.id} sx={{ ...sx, ...sxDefault }}>
        <TableCell padding='none'>
          <Checkbox
            checked={status?.checked}
            disabled={status?.disabled}
            sx={{ color, '&.Mui-checked': { color } }}
            onChange={(_, checked) => this.handleChangeCheckbox({ type: 'unit', checked, value: row })}
          />
        </TableCell>
        <TableCell scope='row' sx={{ maxWidth: '767px' }}>
          <CustomTypography {...{ component: Link, target: '_blank', href: this.getHref(row.id) }} noWrap>
            {this.props.info[row.id]?.Snippet.Title ?? row.id}
          </CustomTypography>
        </TableCell>
        <TableCell sx={{ width: '18rem' }}>{humanNumber(parseInt(row.views + ''))}</TableCell>
        <TableCell sx={{ width: '18rem' }}>{humanNumber(parseInt(row.estimatedMinutesWatched + ''))}</TableCell>
        <TableCell sx={{ width: '18rem' }}>{formatterUSD().format(parseFloat(row.estimatedRevenue + ''))}</TableCell>
      </CustomTableRow>
    )
  }
}

const CustomTableRow = styled(TableRow)({
  '&:last-child td, &:last-child th': { border: 0 },
  borderLeft: `3px solid transparent`
})

const CustomTypography = styled(Typography)({
  width: '100%',
  display: 'block',
  color: '#606060',
  transition: 'all 0.3s',
  textDecoration: 'none',
  '&:hover': {
    color: '#1976d2',
    textDecoration: 'underline'
  }
})
