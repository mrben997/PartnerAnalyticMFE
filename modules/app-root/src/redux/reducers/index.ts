import { combineReducers } from '@reduxjs/toolkit'
import { AnalyticSlice } from './Analytic/AnalyticSlice'

export default combineReducers({
  AnalyticSlice: AnalyticSlice.reducer
})
