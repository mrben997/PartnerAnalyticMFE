import { IFetchModel, IFetchPagination } from './type'

export { TableTemplateContext } from './TableTemplateContext'
export { TableConverter } from './TableConverter'
export { TableFormatter } from './TableFormatter'
export { MapOperators } from './MapOperators'
export { CRUDPannel } from './CRUDPannel'

export type TFetchModel = IFetchModel
export type TFetchPagination<T> = IFetchPagination<T>
