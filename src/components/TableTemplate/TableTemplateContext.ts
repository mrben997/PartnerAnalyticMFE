import { createContext } from 'react'
import { GridCallbackDetails, GridFilterModel, GridPaginationInitialState, GridRowModel, GridSortModel } from '@mui/x-data-grid'
import { IFetchPagination } from './type'

export interface ITableTemplateState<T = any> {
  selectionIds?: GridRowModel
  details?: GridCallbackDetails
  PageInfo: IFetchPagination<T>
  isLoading: boolean
  PaginationModel?: GridPaginationInitialState
  FilterModel?: GridFilterModel
  GridSortModel?: GridSortModel
}

export interface ITableTemplateContext {
  state: ITableTemplateState<any>
}
export const TableTemplateContext = createContext<ITableTemplateContext>({} as any)
