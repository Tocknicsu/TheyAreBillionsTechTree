import React from 'react'
import Techtree from 'containers/techtree/Techtree'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
body {
  margin: 0px;
  padding: 0px;
}
`

export default () => [<GlobalStyle key={0} />, <Techtree key={1} />]
