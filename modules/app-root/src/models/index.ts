import { Graphql } from 'graphql-service-mfe'

export interface IDateOption {
  id: string
  title: string
  value: number[]
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
  date: string
  measure: string
}

export interface ITableData {
  id: string
  title: string
  description?: string
}

export type TQueryParams = Graphql.QReport.TQueryParams

export interface IDataInfo {
  Id: string
  Snippet: {
    Title: string
    Thumbnails: {
      Default__: {
        Height?: number
        Url?: string
        Width?: string
        Etag?: string
      }
    }
  }
}

export interface EntityTimeBase {
  DateCreated: string
  DateUpdated: string
}
export enum EnumChannelType {
  Content = 'Content',
  Claimed = 'Claimed'
}
export type EChannelType = 'Content' | 'Claimed' | EnumChannelType

export enum MediaNetworkStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}
export interface IMediaNetwork extends EntityTimeBase {
  Id: string
  Name: string
  Status: MediaNetworkStatus
  OwnerId: string
  AccountJson: string
  Description: string
  Types: EChannelType[]
}
