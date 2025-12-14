import styled from 'styled-components'
import { mainTheme as theme } from '../../styles/theme'
import BaitaLogo from '../../assets/BaitaLogo.png'

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const { colors } = theme

export const LoginLogo = styled.div`
  height: 230px;
  width: 230px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.red};
  border: none;
  border-radius: 50%;
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
`

export const LogoBaita = styled.img`
  height: 230px;
  width: 230px;
  background-image: url(${BaitaLogo});
  background-size: cover; /* Mude para cover */
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%; /* Se o div for circular */
  overflow: hidden; /* Para garantir que nada vaze */
`

export const LoginBackground = styled.div`
  height: 100vh;
  width: 100%;
  background-color: ${colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
`
export const LoginContainer = styled.div`
  height: max-content;
  width: 660px;
  background-color: ${colors.gray};
  padding: 110px 59px 70px 59px;
  border-radius: 10px;

  h1 {
    font-size: 50px;
    font-family: 'Lilita One', sans-serif;
    font-weight: 400;
    font-style: normal;
    text-align: center;
    margin-bottom: 30px;
  }

  label {
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-style: normal;
    color: ${colors.black};
  }

  a {
    color: ${colors.black};

    &:hover {
      color: ${colors.red};
    }
  }
`
export const LoginInput = styled.input`
  width: 100%;
  height: 40px;
  font-size: 14px;
  background-color: ${colors.white};
  color: ${colors.black};
  margin-bottom: 10px;
  border-radius: 5px;
  border: none;
  outline: none;
  padding-left: 10px;
  margin-bottom: 20px;
`

export const LoginButton = styled.button`
  height: 50px;
  width: 100%;
  background-color: ${colors.yellow};
  color: ${colors.white};
  font-size: 24px;
  font-family: 'Lilita One', sans-serif;
  font-weight: 400;
  font-style: normal;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${colors.red};
  }
`
