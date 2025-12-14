import styled from 'styled-components'
import { mainTheme as theme } from '../../styles/theme'

const { colors } = theme

type FooterContainerProps = {
  $variant?: 'default' | 'menu'
}

export const FooterContainer = styled.footer<FooterContainerProps>`
  height: 88px;
  width: 100%;
  background-color: ${colors.red};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 26px;

  ${({ $variant }) => {
    switch ($variant) {
      case 'menu':
        return `
          border-radius: 0px 20px 20px 20px;
        `
      case 'default':
      default:
        return `
          border-radius: 20px;
        `
    }
  }}
`

export const InfoContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;

  & > h1 {
    font-size: 16px;
    color: ${colors.white};
  }
`

export const FooterContent = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;

  & > h1 {
    font-size: 16px;
    color: ${colors.white};
  }
`
