import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'
import Reducers from './reducers'

const store = configureStore({
  reducer: Reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([thunkMiddleware])
})
export default store
