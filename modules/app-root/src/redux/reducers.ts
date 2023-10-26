import { combineReducers } from '@reduxjs/toolkit'
import { AnalyticSlice } from '../views/Analytic/redux/AnalyticSlice'
import { AvancedModeSlice } from '../views/AvancedMode/redux/AvancedModeSlice'

export default combineReducers({
  AnalyticSlice: AnalyticSlice.reducer,
  AvancedModeSlice: AvancedModeSlice.reducer
})
