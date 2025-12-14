import styled from 'styled-components'
import { mainTheme as theme } from '../../styles/theme'
import LogoBaita from '../../assets/BaitaLogo.png'

const { colors } = theme

export const LogoContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;

  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
`

export const Logo = styled.div`
  height: 130px;
  width: 130px;
  background-image: url(${LogoBaita});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
  overflow: hidden;
`

export const MenuContainer = styled.div`
  height: 100%;
  width: 250px;
  background-color: ${colors.red};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  border-radius: 20px 20px 0 0;
`

export const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;

  & > ul {
    width: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    & > li {
      list-style: none;
      width: 100%;
      display: flex;
      justify-content: center;

      & > button {
        width: 80%;
        padding: 10px 0;
        font-size: 20px;
        color: ${colors.white};
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
  }
`
