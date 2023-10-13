import { Dictionary } from '@reduxjs/toolkit'

export interface IRowData {
  id: string
  title: string
  views: number
  estimatedMinutesWatched: number
  estimatedRevenue: number
}
export interface IMapSelected {
  checked: boolean
  color?: string
  disabled?: boolean
}
export interface IMapSelecteds {
  colors: string[]
  map: Dictionary<IMapSelected> // key = IRowData.id
}

export type TOnChangeCheckboxParams = { type: 'unit' | 'all'; value: IRowData; checked: boolean }
export type TOnChangeCheckbox = (args: TOnChangeCheckboxParams) => void
