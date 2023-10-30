import React, { Component } from 'react'
import { Box, Link, Typography, styled } from '@mui/material'
import { formatNumber, formatterUSD } from 'csmfe/helper'
import { Checkbox, SxProps, TableCell, TableRow, Theme } from '@mui/material'
import { IRowData, TOnChangeCheckbox } from '../../../utils/SelectedProcessor/type'
import SelectedProcessor from '../../../utils/SelectedProcessor'

interface IProps {
  data: IRowData
  onChangeCheckbox: TOnChangeCheckbox
  checked?: boolean
  disabled?: boolean
  color?: string
  colorDefault?: string
  idColorDefaulted?: boolean
  title: string
  baseUrl: string
  imageUrl?: string
}

export default class ItemRow extends Component<IProps> {
  get isTotal(): boolean {
    return SelectedProcessor.isTotalRow(this.props.data.id as string)
  }

  getHref = (): string => this.props.baseUrl + this.props.data.id

  renderTitleCell = () => {
    if (this.isTotal) return this.props.title
    return (
      <CustomTypography {...{ component: Link, target: '_blank', href: this.getHref() }} noWrap>
        {this.props.title}
      </CustomTypography>
    )
  }

  getColor = () => {
    if (this.props.idColorDefaulted) return this.props.colorDefault
    return this.props.color
  }

  getStyledWrap = () => {
    let sx: SxProps<Theme> = { borderLeftColor: 'transparent' }
    const { colorDefault } = this.props
    if (this.props.idColorDefaulted && colorDefault) sx = { borderLeftColor: colorDefault }
    return sx
  }

  render() {
    const color = this.getColor() ?? '#606060'
    const rowType = SelectedProcessor.isTotalRow(this.props.data.id as string) ? 'total' : 'unit'
    return (
      <CustomTableRow type={rowType} sx={this.getStyledWrap()}>
        <TableCell padding='none'>
          <Checkbox
            checked={this.props.checked}
            disabled={this.props.disabled}
            sx={{ color, '&.Mui-checked': { color } }}
            onChange={(_, checked) => this.props.onChangeCheckbox({ type: 'unit', checked, value: this.props.data })}
          />
        </TableCell>
        <CustomTableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!this.isTotal && (
              <Box
                component='img'
                src={this.props.imageUrl}
                alt='thumbnail'
                sx={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', flex: '0 0 auto' }}
              />
            )}
            {this.renderTitleCell()}
          </Box>
        </CustomTableCell>
        <CustomTableCellNumber>{formatNumber.format(parseInt(this.props.data.views + ''))}</CustomTableCellNumber>
        <CustomTableCellNumber>
          {formatNumber.format(parseInt(this.props.data.estimatedMinutesWatched + ''))}
        </CustomTableCellNumber>
        <CustomTableCellNumber>{formatterUSD().format(parseFloat(this.props.data.estimatedRevenue + ''))}</CustomTableCellNumber>
      </CustomTableRow>
    )
  }
}

const CustomTableRow = styled(TableRow)<{ type?: 'unit' | 'total' }>(({ type }) => {
  let obj = { '&:last-child td, &:last-child th': { border: 0 }, borderLeft: `3px solid transparent` }
  if (type === 'total') obj = Object.assign(obj, { '& .MuiTableCell-root': { fontWeight: 700 } })
  return obj
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

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  maxWidth: '768.5px',
  [theme.breakpoints.down('md')]: { maxWidth: '200px' }
}))

const CustomTableCellNumber = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down('md')]: { maxWidth: '100px' }
}))
