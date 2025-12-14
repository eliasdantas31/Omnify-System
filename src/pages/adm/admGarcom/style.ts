import styled from 'styled-components'
import { mainTheme as theme } from '../../../styles/theme'

const { colors } = theme

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  /* padding: 20px; */
  background: ${colors.lightGray};
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const HeaderLine = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
`

export const SearchBar = styled.div`
  height: max-content;
  width: 255px;
  display: flex;
  gap: 10px;

  label {
    height: 50px;
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    border-radius: 10px 0px 0px 10px;
    color: ${colors.black};
    background-color: ${colors.white};
    cursor: pointer;
  }

  input {
    height: 50px;
    width: 100%;
    text-align: center;
    background-color: ${colors.white};
    color: ${colors.black};
    font-family: 'Lilita One', sans-serif;
    font-size: 24px;
    border: none;
    border-radius: 0px 10px 10px 0px;
  }
`

export const AddButton = styled.button`
  width: 255px;
  background: ${colors.red};
  color: ${colors.white};
  font-family: 'Lilita One', sans-serif;
  font-size: 20px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  gap: 8px;
  align-items: center;
  transition: 0.2s;

  i {
    font-size: 22px;
  }

  &:hover {
    opacity: 0.9;
  }
`

export const FormCard = styled.div`
  width: 350px;
  padding: 20px;
  background: ${colors.white};
  border-radius: 15px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
  text-align: center;
  margin-bottom: 25px;

  h3 {
    margin-bottom: 20px;
  }

  button {
    width: 100%;
    padding: 10px;
    margin-top: 15px;
    background: ${colors.red};
    color: ${colors.white};
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
  }
`

export const InputGroup = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 15px;

  label {
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid ${colors.gray};
    font-size: 16px;
    margin-top: 5px;
  }
`

export const GarcomList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`

export const GarcomItem = styled.div`
  background: ${colors.white};
  padding: 15px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);

  p {
    font-size: 22px;
    color: ${colors.black};
  }

  i {
    font-size: 22px;
    color: ${colors.red};
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
`

export const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ConfirmBox = styled.div`
  width: 320px;
  padding: 25px;
  background: ${colors.white};
  border-radius: 15px;
  text-align: center;
  box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.3);

  h3 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 25px;
    color: ${colors.black};
    font-size: 16px;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }

  .cancel {
    width: 45%;
    background: ${colors.gray};
    border: none;
    padding: 10px;
    border-radius: 8px;
    color: ${colors.black};
    cursor: pointer;
    font-size: 16px;
  }

  .confirm {
    width: 45%;
    background: ${colors.red};
    border: none;
    padding: 10px;
    border-radius: 8px;
    color: ${colors.white};
    cursor: pointer;
    font-size: 16px;
  }
`
