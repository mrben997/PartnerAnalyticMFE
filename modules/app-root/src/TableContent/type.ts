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
  activedBackground?: boolean
}
export interface IMapSelecteds {
  colors: string[]
  max: number
  map: Dictionary<IMapSelected> // key = IRowData.id
}

export type TOnChangeCheckboxParams = { type: 'unit'; value: IRowData; checked: boolean } | { type: 'all'; checked: boolean }

export type TOnChangeCheckbox = (args: TOnChangeCheckboxParams) => void
export type TOnChangeCheckboxAll = (checked: boolean) => void
