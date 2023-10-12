import React, { FC, useCallback } from 'react'
import { visuallyHidden } from '@mui/utils'
import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { ColumnHeader, Order } from './type'
import { TabAvancedModelMetrics } from './helper'

interface IProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
  data: ColumnHeader[]
}

const EnhancedTableHead: FC<IProps> = (props) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props

  const getName = (item: ColumnHeader) => {
    return TabAvancedModelMetrics.find((x) => x.Value.toLocaleLowerCase() === item?.Name?.toLocaleLowerCase())?.Name ?? ''
  }
  const renderHeader = useCallback(() => {
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }
    console.log(props.data)

    return props.data.map((item) => {
      return (
        <TableCell key={item.Name} sortDirection={orderBy === item.Name ? order : false}>
          <TableSortLabel
            active={orderBy === item.Name}
            direction={orderBy === item.Name ? order : 'asc'}
            onClick={createSortHandler(item.Name as any)}
            sx={{ fontWeight: 'bold' }}
          >
            {getName(item)}
            {orderBy === item.Name ? (
              <Box component="span" sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            ) : null}
          </TableSortLabel>
        </TableCell>
      )
    })
  }, [props.data, order, orderBy, onRequestSort])
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            // checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {renderHeader()}
      </TableRow>
    </TableHead>
  )
}

export default EnhancedTableHead
