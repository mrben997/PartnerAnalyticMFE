import React, { Component } from 'react'
import { Dictionary } from '@reduxjs/toolkit'
import { Container, TableContainer, TableSortLabel, TableSortLabelProps, Typography, styled } from '@mui/material'
import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import SelectedProcessor, { TSelectedProcessorMaping } from '../../utils/SelectedProcessor'
import { IDataInfo } from '../../models'
import { IRowData, TOnChangeCheckbox } from '../../utils/SelectedProcessor/type'
import RowRender from './RowRender'
import { getThumbnailYoutube } from '../../utils/helper'

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
          <Table>
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
          <CustomTableCellNumber>{this.renderCellHeader('Views', 0)}</CustomTableCellNumber>
          <CustomTableCellNumber>{this.renderCellHeader('Watch time (hours)', 1)}</CustomTableCellNumber>
          <CustomTableCellNumber>{this.renderCellHeader('Estimated partner revenue', 2)}</CustomTableCellNumber>
        </TableRow>
      </TableHead>
    )
  }

  renderCellHeader = (title: string, index: number) => {
    const isActive = this.props.metricIndex === index
    if (!isActive) return <Typography noWrap>{title}</Typography>
    const p: TableSortLabelProps = isActive ? { active: true, direction: 'desc' } : {}
    return (
      <TableSortLabel {...p} sx={{ cursor: 'default' }}>
        {title}
      </TableSortLabel>
    )
  }

  renderRow = (row: IRowData) => {
    const ids = SelectedProcessor.getIdActives(this.props.tableDataMaping)
    const status = this.props.tableDataMaping[row.id]
    const imageUrl = this.props.info[row.id]?.Snippet.Thumbnails.Default__.Url

    return (
      <RowRender
        key={row.id}
        data={row}
        baseUrl={this.props.baseUrl}
        onChangeCheckbox={this.props.onChangeCheckbox}
        title={(this.props.info[row.id]?.Snippet.Title ?? row.id) + ''}
        checked={status?.checked}
        disabled={status?.disabled}
        color={status?.color}
        colorDefault={this.props.tableDataMapingDefault[row.id]?.color}
        idColorDefaulted={ids.length < 1}
        imageUrl={getThumbnailYoutube(row.id + '', imageUrl)}
      />
    )
  }
}

const CustomTableCellNumber = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  color: '#6c6c6c',
  [theme.breakpoints.down('md')]: { maxWidth: '100px' }
}))
