import { GridColDef, getGridNumericOperators, getGridStringOperators } from '@mui/x-data-grid'
import { EOperator } from './type'

const StringMap = {
  contains: EOperator.Contains,
  equals: EOperator.Equal,
}

const NumericMap = {
  '=': EOperator.Equal,
  '!=': EOperator.NotEqual,
  '>': EOperator.GreaterThan,
  '>=': EOperator.GreaterThanOrEqual,
  '<': EOperator.LessThan,
  '<=': EOperator.LessThanOrEqual,
}

export const getCustomGridNumericOperators = () => {
  const keys = new Set(Object.keys(NumericMap))
  const options = getGridNumericOperators()
    .filter((x) => keys.has(x.value))
    .map((x) => {
      x.label = x.value
      x.value = (NumericMap as any)[x.value] + ''
      return x
    })
  return options
}

export const getCustomGridStringOperators = () => {
  const keys = new Set(Object.keys(StringMap))
  const options = getGridStringOperators().filter((x) => keys.has(x.value))
  return options.map((x) => {
    x.label = x.value
    x.value = (StringMap as any)[x.value] + ''
    return x
  })
}

export const MapOperators = (option: GridColDef) => {
  switch (option.type) {
    // case 'number':
    //   return getCustomGridNumericOperators()
    case 'string':
    default:
      return getCustomGridStringOperators()
  }
}
export default MapOperators
