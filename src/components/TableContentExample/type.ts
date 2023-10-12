/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ColumnHeader {
  Name: string
}

export interface ResponseQuery<TRow = any> {
  ColumnHeaders: ColumnHeader[]
  Rows: TRow[]
}

export interface ResponseQuerys {
  Status: string
  Data: ResponseQuery
}

export type Order = 'asc' | 'desc'

export interface ITabAvancedModelMetrics {
  Name: string
  Value: string
  format?: (value: any) => string
}
