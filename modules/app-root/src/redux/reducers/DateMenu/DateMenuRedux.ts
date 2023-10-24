import { connect } from 'react-redux'
import { EntityState } from '@reduxjs/toolkit'
import { AnalyticSlice } from '../Analytic/AnalyticSlice'
import { IDateOption } from '../../../utils/type'
import { AppDispatch, RootState } from '../../type'
import DateMenu from '../../../views/DateMenu'

export interface DateMenuReduxState {
  dates: EntityState<IDateOption>
  dateId: string
}

export interface DateMenuReduxDispatch {
  setdateId: (params: string) => void
}

const mapStateToProps = (state: RootState): DateMenuReduxState => ({
  dates: state.AnalyticSlice.dates,
  dateId: state.AnalyticSlice.dateId
})

const appDispatchToProps = (dispatch: AppDispatch): DateMenuReduxDispatch => ({
  setdateId: (params: string) => {
    dispatch(AnalyticSlice.actions.setDateId(params))
  }
})

export const DateMenuRedux = connect(mapStateToProps, appDispatchToProps)(DateMenu)
export default DateMenuRedux
