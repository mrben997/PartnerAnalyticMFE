import React, { Component } from 'react'
import { Container, TableContainer, TableSortLabel } from '@mui/material'
import { Checkbox, SxProps, Table, TableBody, TableCell, TableHead, TableRow, Theme } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { IMapSelected, IRowData, TOnChangeCheckbox } from '../../utils/type'
import SelectedProcessor from '../../utils/SelectedProcessor'

interface IProps {
  selectedProcessor: SelectedProcessor
  metricIndex: number
}
interface IState {}

export default class AvancedModeTable extends Component<IProps, IState> {
  onChangeCheckbox: TOnChangeCheckbox = (params) => {
    switch (params.type) {
      case 'unit': {
        this.props.selectedProcessor.selectUnitCheckbox(params.value.id, params.checked)
        this.forceUpdate()
        return
      }
      case 'all': {
        this.props.selectedProcessor.selectAllCheckbox(params.checked)
        this.forceUpdate()
        return
      }
      default:
        break
    }
  }

  getCheckboxControlStatus = () => {
    const { idActives, max } = this.props.selectedProcessor
    const checked = idActives.length === max
    const indeterminate = idActives.length > 0 && idActives.length < max
    return { checked, indeterminate }
  }

  handleChangeCheckbox: TOnChangeCheckbox = (params) => {
    if (!this.onChangeCheckbox) return
    this.onChangeCheckbox(params)
  }

  handleChangeCheckBoxAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!this.onChangeCheckbox) return
    this.onChangeCheckbox({ type: 'all', checked: event.target.checked })
  }

  render() {
    return (
      <Container maxWidth={false} sx={{ minHeight: '15rem', mt: '24px' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            {this.renderHeader()}
            <TableBody>
              {this.props.selectedProcessor.rows.map((row) => {
                const status = this.props.selectedProcessor.maping[row.id]
                return this.renderRow(row, status)
              })}
            </TableBody>
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

  renderRow = (row: IRowData, status?: IMapSelected) => {
    const check = this.props.selectedProcessor.isTotalRow(row.id)
    const sx: SxProps<Theme> = check ? { '& .MuiTableCell-root': { fontWeight: 700 } } : {}
    const color = status?.color ?? '#606060'
    // const rowDefault = this.props.selectedProcessor.selectedDefault[row.id]
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
        <TableCell scope='row'>{row.title}</TableCell>
        <TableCell>{row.views}</TableCell>
        <TableCell>{row.estimatedMinutesWatched}</TableCell>
        <TableCell>{row.estimatedRevenue}</TableCell>
      </TableRow>
    )
  }
}
