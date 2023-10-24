import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'
import Reducers from './reducers'

export * from './type'
export * from './reducers/declaration'

const store = configureStore({
  reducer: Reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([thunkMiddleware])
})
export default store
