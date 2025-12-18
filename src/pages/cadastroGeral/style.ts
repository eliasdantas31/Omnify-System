import styled from 'styled-components'
import { mainTheme as theme } from '../../styles/theme'

const { colors } = theme

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Form = styled.form`
  height: 70%;
  width: 70%;
  background-color: ${colors.red};
  border-radius: 8px;

  div {
    height: max-content;
    width: 80%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    label {
      color: ${colors.black};
      font-size: 1.2rem;
    }

    input {
      height: 30px;
      width: 60%;
      border-radius: 4px;
      border: none;
      padding: 0 10px;
      font-size: 1rem;
    }

    button {
      height: 35px;
      width: 100%;
      background-color: ${colors.red};
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      cursor: pointer;

      &:hover {
        background-color: ${colors.lightGray};
      }
    }
  }
`
