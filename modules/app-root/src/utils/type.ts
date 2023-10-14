export enum ENetwork {
  DinoCollab = 'DinoCollab',
  SuperNetwork = 'SuperNetwork'
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
