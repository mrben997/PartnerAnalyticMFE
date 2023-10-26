import React from 'react'
import { Provider } from 'react-redux'
import store from './redux'
import AnalyticRedux from './views/Analytic/redux/AnalyticRedux'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AnalyticRedux />
      </Provider>
    )
  }
}
