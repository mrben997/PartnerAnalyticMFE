import { connect } from 'react-redux'
import { EntityState } from '@reduxjs/toolkit'
import { AnalyticSlice } from '../analytic/AnalyticSlice'
import { IDateOption } from '../../../utils/type'
import { AppDispatch, RootState } from '../../type'
import DateMenu from '../../../views/DateMenu'
import DateOption from '../../../utils/DateOption'
import { fetchAnalyticThunk } from '../analytic/AnalyticThunk'

export interface DateMenuReduxState {
  dates: IDateOption[]
  dateIndex: number
}

export interface DateMenuReduxDispatch {
  setdateId: (params: number) => void
}

const mapStateToProps = (state: RootState): DateMenuReduxState => ({
  dates: DateOption.data,
  dateIndex: state.AnalyticSlice.dateIndex
})

const appDispatchToProps = (dispatch: AppDispatch): DateMenuReduxDispatch => ({
  setdateId: (params) => {
    dispatch(AnalyticSlice.actions.setDateId(params))
    dispatch(fetchAnalyticThunk())
  }
})

export const DateMenuRedux = connect(mapStateToProps, appDispatchToProps)(DateMenu)
export default DateMenuRedux
