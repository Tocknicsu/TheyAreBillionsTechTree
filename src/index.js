import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import RootRouter from 'js/routes'
import { AppContainer } from 'react-hot-loader'

if (typeof document !== 'undefined' && window) {
  window.onload = () => {
    return render(
      <AppContainer>
        <RootRouter />
      </AppContainer>,
      document.getElementById('app')
    )
  }
}

if (module.hot) {
  module.hot.accept('./js/routes', () => {
    const NextRootRouter = require('./js/routes').default
    render(
      <AppContainer>
        <NextRootRouter />
      </AppContainer>,
      document.getElementById('app')
    )
  })
}
