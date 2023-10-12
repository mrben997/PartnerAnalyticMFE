import { GridFilterModel, GridFilterItem, GridPaginationInitialState, GridLogicOperator } from '@mui/x-data-grid'
import { EOperator, IFetchModel } from './type'

type TSorts = { [key: string]: string }[]
interface IResultFilterGraphql {
  take?: number
  skip?: number
  filter?: string
  sort?: TSorts
}
interface IConfig<T> {
  pagination?: GridPaginationInitialState
  searchOptions: (keyof T)[]
}
class TableConverterBase {
  _mapOperator = (item: GridFilterItem) => {
    return ''
    // if (!item.operatorValue || !item.value) return ''
    // switch (parseInt(item.operatorValue)) {
    //   case EOperator.Contains:
    //     return `${item.columnField}.contains("${item.value}")`
    //   case EOperator.Equal:
    //     return `${item.columnField}=="${item.value}"`
    //   case EOperator.NotEqual:
    //     return `${item.columnField}!="${item.value}"`
    //   case EOperator.GreaterThan:
    //     return `${item.columnField}>"${item.value}"`
    //   case EOperator.GreaterThanOrEqual:
    //     return `${item.columnField}>="${item.value}"`
    //   default:
    //     return ''
    // }
  }

  _covertFilterModal = (filter?: GridFilterModel): string => {
    if (!filter) return ''
    const filters = filter.items.map(this._mapOperator)
    let concatenation = ' || '
    if (filter.logicOperator === GridLogicOperator.And) concatenation = ' && '
    return filters.filter((e) => !!e).join(concatenation)
  }

  _covertSearchOptions = (searchOptions: string[], text?: string) => {
    if (!text) return ''
    return searchOptions.map((s) => `${s}.contains("${text}")`).join(' || ')
  }

  _converSearchFilterModal = (args: { texts?: any[]; searchOptions: string[] }) => {
    const arr = args.texts?.filter((e) => !!e)
    return arr?.map((e) => this._covertSearchOptions(args.searchOptions, e)).join(' || ')
  }

  graphql = <T>(model: Partial<IFetchModel>, config: IConfig<T>) => {
    const page: number = model.PaginationModel?.paginationModel?.page ?? config.pagination?.paginationModel?.page ?? 0
    const take: number = model.PaginationModel?.paginationModel?.pageSize ?? config.pagination?.paginationModel?.pageSize ?? 0

    const filterSearch = this._converSearchFilterModal({
      texts: model.FilterModel?.quickFilterValues,
      searchOptions: config.searchOptions.map<string>((e) => e.toString()),
    })
    const filterOperator = this._covertFilterModal(model.FilterModel)
    let concatenation = filterSearch && filterOperator ? ' || ' : ''
    const filter = `${filterSearch ? filterSearch + concatenation : ''}${filterOperator ?? ''}`

    let sort: TSorts = []
    const gsm = model.GridSortModel
    if (gsm && gsm[0] && gsm[0].sort) sort = [{ [gsm[0].field]: gsm[0].sort.toUpperCase() ?? 'ASC' }]

    let filterResult: IResultFilterGraphql = { take, skip: page * take, filter, sort }
    // Remove properties with unknown values.
    if (!filter) delete filterResult.filter
    if (filterResult.sort && filterResult.sort.length < 1) delete filterResult.sort

    return filterResult
  }

  paginationToFilter = (args: { pageSize: number; page: number }) => {
    return { skip: args.page * args.pageSize, take: args.pageSize }
  }
}
export const TableConverter = new TableConverterBase()
export default TableConverter
