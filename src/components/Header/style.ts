import styled from 'styled-components'
import { mainTheme as theme } from '../../styles/theme'
import LogoBaita from '../../assets/BaitaLogo.png'

const { colors } = theme

type HeaderContentProps = {
  $variant?: 'adm' | 'garcom'
}

type HeaderLogoProps = {
  $variant?: 'adm' | 'garcom'
}

export const HeaderContainer = styled.header<HeaderLogoProps>`
  height: 88px;
  width: 100%;
  border-radius: 20px;
  background-color: ${colors.red};
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 0 26px;

  ${({ $variant }) => {
    switch ($variant) {
      case 'adm':
        return `
          .admLogo {
            display: flex;
          }
          .garcomLogo {
            display: none;
          }
        `
      case 'garcom':
        return `
          .admLogo {
            display: none;
          }
          .garcomLogo {
            display: flex;
          }
        `
      default:
        return `
          .admLogo {
            display: flex;
          }
          .garcomLogo {
            display: none;
          }
        `
    }
  }}
`

export const LogoContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
`

export const Logo = styled.div`
  height: 75px;
  width: 75px;
  background-image: url(${LogoBaita});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

export const HeaderContent = styled.ul<HeaderContentProps>`
  height: auto;
  width: 100%;
  display: flex;
  align-items: center;

  ${({ $variant }) => {
    switch ($variant) {
      case 'adm':
        return `
          justify-content: space-around;

          & > li.adm {
            list-style: none;
            margin-left: 20px;
          }

          & > li.garcom {
            display: none;
          }
        `
      case 'garcom':
        return `
          justify-content: flex-end;

          .adm {
            display: none;
          }

          .garcom {
            list-style: none;
            margin-left: 20px;
          }
        `
      default:
        return `
          justify-content: space-around;

          & > li.adm {
            list-style: none;
            margin-left: 20px;
          }

          & > li.garcom {
            display: none;
          }
        `
    }
  }}

  & > li {
    & > button {
      color: ${colors.white};
      font-size: 28px;
      font-family: 'Lilita One', sans-serif;
      background: none;
      border: none;
      cursor: pointer;

      &::after {
        content: '';
        display: block;
        width: 0;
        height: 5px;
        background: ${colors.white};
        transition: width 0.5s;
      }

      &:hover::after {
        width: 100%;
      }
    }
  }
`
