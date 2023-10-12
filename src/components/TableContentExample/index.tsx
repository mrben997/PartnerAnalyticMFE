import React, { Component } from 'react'
import { Dictionary } from '@reduxjs/toolkit'
import { Box, Typography, Paper, Checkbox } from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { Order, ResponseQuery, ResponseQuerys } from './type'
import { TabAvancedModelMetrics, getComparator, stableSort } from './helper'
import EnhancedTableHead from './EnhancedTableHead'
import EnhancedTableToolbar from './EnhancedTableToolbar'

export * from './declaration'

interface TableContentProps {
  data?: ResponseQuerys
  Total?: ResponseQuery
  ChartKeys: string[]
  HasSelect: boolean
  SetSelects: (keys: string[]) => void
  ChartType: string
  SetShowTotal: (show: boolean) => void
  MetaName: Dictionary<string>
}

interface TableContentState {
  order: Order
  // selected: readonly string[]
  page: number
  dense: boolean
  rowsPerPage: number
}

const maxSelecttion = 10

export default class TableContentExample extends Component<TableContentProps, TableContentState> {
  constructor(props: TableContentProps) {
    super(props)
    this.state = {
      order: 'desc',
      page: 0,
      dense: false,
      rowsPerPage: 50,
    }
  }

  getChartLines = () => {
    return this.props.HasSelect ? this.props.ChartKeys : []
  }
  handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    // const isAsc = this.props.ChartType as any === property && this.state.order === 'asc';
    // this.setState({
    //     order: isAsc ? 'desc' : 'asc',
    //     orderBy: property as any
    // })
  }
  getRowId = (row: any) => {
    return row[0]
  }
  handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = this.props.data?.Data?.Rows.map(this.getRowId)

      newSelected && this.props.SetSelects(newSelected.slice(0, maxSelecttion)) // this.setState({ selected: newSelected.slice(0, maxSelecttion) })
      return
    }
    this.props.SetSelects([])
  }

  handleClick = (_: React.MouseEvent<unknown>, name: string) => {
    const chartKeys = [...this.getChartLines()]
    const selectedIndex = chartKeys.indexOf(name)

    if (selectedIndex < 0) chartKeys.push(name)
    else chartKeys.splice(selectedIndex, 1)

    this.props.SetSelects(chartKeys.slice(0, maxSelecttion))
  }

  isSelected = (name: string) => this.getChartLines().indexOf(name) !== -1

  renderTotal = () => {
    const row = this.props.Total?.Rows ?? []
    const tmp =
      this.props.Total?.ColumnHeaders.reduce((a, b, index) => {
        if (!a[b.Name]) a[b.Name] = 0
        a[b.Name] += parseInt(row.reduce((a, b) => a + b[index], 0))
        return a
      }, {} as any) ?? {}

    const dataRow =
      this.props.data?.Data.ColumnHeaders.reduce((a, b, index) => {
        if (b.Name in tmp) {
          const format = TabAvancedModelMetrics.find((x) => x.Value === b.Name)?.format
          a[index] = format ? format(tmp[b.Name]) : tmp[b.Name]
        }
        return a
      }, [] as any[]) ?? []

    const labelId = `enhanced-table-checkbox-${0}`

    return (
      <TableRow hover role="checkbox" tabIndex={-1} key={this.getRowId(row)}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            inputProps={{ 'aria-labelledby': labelId }}
            checkedIcon={<CheckBoxIcon sx={{ color: 'black' }} />}
            onChange={(e) => this.props.SetShowTotal(e.currentTarget.checked)}
          />
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
        {dataRow.map((column: any, indexColumn: number) => (
          <TableCell sx={{ fontWeight: 'bold' }} key={'key' + indexColumn}>
            {column}
          </TableCell>
        ))}
      </TableRow>
    )
  }
  renderBody = () => {
    const tmps = stableSort(this.props.data?.Data?.Rows ?? [], getComparator(this.state.order, this.props.ChartType))
    const fotmates: any[] =
      this.props.data?.Data.ColumnHeaders.reduce((a, b, index) => {
        a[index] = TabAvancedModelMetrics.find((x) => x.Value === b.Name)?.format
        return a
      }, [] as any[]) ?? []

    return tmps.map((row, index) => {
      const isItemSelected = this.isSelected(this.getRowId(row))
      const labelId = `enhanced-table-checkbox-${index}`
      const indexColor = this.props.ChartKeys.findIndex((x) => x === row[0])
      // const color = getColor(row[0]?.toString(), indexColor)
      const lengthSelect = this.getChartLines().length
      return (
        <TableRow
          hover
          onClick={(event) => this.handleClick(event, this.getRowId(row))}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={this.getRowId(row)}
          selected={isItemSelected}
        >
          <TableCell
            padding="checkbox"
            // sx={this.props.HasSelect || indexColor < 0 ? {} : { borderLeft: '2px solid ' + color }}
            sx={this.props.HasSelect || indexColor < 0 ? {} : { borderLeft: '2px solid ' + 'red' }}
          >
            <Checkbox
              checked={isItemSelected}
              inputProps={{ 'aria-labelledby': labelId }}
              disabled={lengthSelect === maxSelecttion && !isItemSelected}
              // sx={{ color: this.props.HasSelect || indexColor < 0 ? '' : color }}
              checkedIcon={
                <CheckBoxIcon
                // sx={{ color: getColor(row[0]?.toString()) }}
                />
              }
            />
          </TableCell>
          {(row as any).map((column: any, indexColumn: number) => {
            if (indexColumn === 0) {
              column = this.props.MetaName[column] ? this.props.MetaName[column] : column
              return (
                <TableCell sx={{ maxWidth: '300px' }} key={'key' + indexColumn}>
                  <Typography noWrap>{column}</Typography>
                </TableCell>
              )
            } else {
              return (
                <TableCell key={'key' + indexColumn}>{fotmates[indexColumn] ? fotmates[indexColumn](column) : column}</TableCell>
              )
            }
          })}
        </TableRow>
      )
    })
  }
  render() {
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      this.state.page > 0
        ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - (this.props.data?.Data?.Rows?.length ?? 0))
        : 0
    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={this.getChartLines().length} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={this.state.dense ? 'small' : 'medium'}>
              <EnhancedTableHead
                numSelected={this.props.ChartKeys.length}
                order={this.state.order}
                orderBy={this.props.ChartType}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={this.props.data?.Data?.Rows?.length ?? 0}
                data={this.props.data?.Data?.ColumnHeaders ?? []}
              />
              <TableBody>
                {this.renderTotal()}
                {this.renderBody()}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (this.state.dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    )
  }
}
