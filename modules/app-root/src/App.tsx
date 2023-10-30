import React from 'react'
import { Provider } from 'react-redux'
import { AnalyticRedux } from './views/Analytic'
import { store } from './redux'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AnalyticRedux />
      </Provider>
    )
  }
}
