import { combineReducers } from '@reduxjs/toolkit'
import { AnalyticSlice } from '../views/Analytic'
import { AvancedModeSlice } from '../views/AvancedMode'

export default combineReducers({
  AnalyticSlice: AnalyticSlice.reducer,
  AvancedModeSlice: AvancedModeSlice.reducer
})
