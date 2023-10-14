import { combineReducers } from '@reduxjs/toolkit'
import { AnalyticSlice } from './analytic/AnalyticSlice'

export default combineReducers({
  AnalyticSlice: AnalyticSlice.reducer
})
