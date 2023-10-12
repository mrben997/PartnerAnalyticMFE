/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dictionary } from '@reduxjs/toolkit'
import { ITabAvancedModelMetrics, Order } from './type'
import { FormatNumber, FormatterUSD } from '../../core/helper'

export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}

type TGetComparator = <Key extends keyof any>(
  order: Order,
  orderBy: Key
) => (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number

export const getComparator: TGetComparator = (order, orderBy) => {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
}

export const TabAvancedModelMetrics: ITabAvancedModelMetrics[] = [
  { Name: 'Views', Value: 'views', format: (value) => FormatNumber.format(value) },
  { Name: 'Watch time (hours)', Value: 'estimatedMinutesWatched', format: (value) => FormatNumber.format(value) },
  { Name: 'Estimated partner revenue', Value: 'estimatedRevenue', format: (value) => FormatterUSD().format(value) }
]

const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe']
const ColorMap: Dictionary<string> = {}
export const getColor = (key: string, index?: number) => {
  return index !== undefined ? colors[index % colors.length] : ColorMap[key]
}

export const stableSort = <T>(array: readonly T[], comparator: (a: T, b: T) => number) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}
