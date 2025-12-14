import { createGlobalStyle } from 'styled-components'
import { mainTheme as theme } from './theme'

export const { colors } = theme

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  html, body{
    height: 100%;
    background-color: ${colors.lightGray};
  }
`
