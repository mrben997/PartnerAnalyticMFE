import React from 'react'
import { Provider } from 'react-redux'
import store, { AnalyticRedux } from './redux'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AnalyticRedux />
      </Provider>
    )
  }
}
