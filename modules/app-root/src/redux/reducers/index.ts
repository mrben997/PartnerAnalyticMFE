import { combineReducers } from '@reduxjs/toolkit'
import { AnalyticSlice } from './analytic/AnalyticSlice'
import { AvancedModeSlice } from './avanced-mode/AvancedModeSlice'

export default combineReducers({
  AnalyticSlice: AnalyticSlice.reducer,
  AvancedModeSlice: AvancedModeSlice.reducer
})
