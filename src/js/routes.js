import React from 'react'
import { Switch, Route } from 'react-router'
import AppComponent from 'containers/App'

import { HashRouter } from 'react-router-dom'

export default () => (
  <HashRouter>
    <Switch>
      <Route path="/" component={AppComponent} />
    </Switch>
  </HashRouter>
)
