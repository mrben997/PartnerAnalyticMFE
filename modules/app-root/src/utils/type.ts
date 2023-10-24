import { Graphql } from 'graphql-service-mfe'

export enum ENetwork {
  DinoCollab = 'DinoCollab',
  SuperNetwork = 'SuperNetwork'
}

export interface INetwork {
  id: string
  title: string
  value: ENetwork
}

export interface IDateOption {
  id: string
  title: string
  value: string[]
}

export interface IChartDetail {
  title: string
  total: number
  value: number[]
}

export interface IChartData {
  labels: string[]
  details: IChartDetail[]
}

export interface IAvancedModeTableDTO {
  id: string
  title: string
}

export interface ITopData {
  title: string
  value: number
  imageUrl: string
}

export interface ITopDataDTO extends ITopData {
  percent: number
}

export interface ITopDataConfig {
  title: string
  startDate: string
  endDate: string
  measure: string
}

export interface ITableData {
  id: string
  title: string
  description?: string
}

export type TQueryParams = Graphql.QReport.TQueryParams
