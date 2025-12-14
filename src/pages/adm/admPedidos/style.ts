import styled from 'styled-components'
import { mainTheme as theme } from '../../styles/theme'

const { colors } = theme

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  padding: 15px;
`

// estilização do Menu topo

export const PedidosMenu = styled.div`
  height: max-content;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;

  div {
    display: flex;
    gap: 10px;
  }
`

export const SearchBar = styled.div`
  height: max-content;
  width: 255px;
  display: flex;

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
    font-weight: normal;
    border: none;
    border-radius: 0px 10px 10px 0px;
  }
`

export const PedidosOptions = styled.div`
  height: max-content;
  width: 255px;
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${colors.white};
    color: ${colors.black};
    font-family: 'Lilita One', sans-serif;
    font-size: 24px;
    border: none;
    border-radius: 10px;
    gap: 10px;
    cursor: pointer;
  }

  div {
    height: max-content;
    width: 100%;
    display: none;
    button {
      background-color: ${colors.white};
    }
  }
`

// estilização do painel de pedidos

export const PedidosContainer = styled.div`
  height: max-content;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`
export const PedidosContent = styled.div`
  height: 650px;
  width: 100%;
  padding: 15px 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: ${colors.white};
  font-family: 'Lilita One', sans-serif;
  font-size: 24px;

  :first-child {
    background-color: ${colors.yellow};
  }

  :nth-child(2) {
    background-color: ${colors.red};
  }

  :last-child {
    background-color: ${colors.green};
  }

  div {
    height: max-content;
    width: 100%;
  }
`

export const ItensList = styled.div`
  flex: 1;
  height: max-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
  align-items: center;
  gap: 10px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.lightGray};
    border-radius: 3px;
  }
`

export const Item = styled.div`
  height: max-content;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  background-color: ${colors.white};
  color: ${colors.black};

  h1 {
    font-size: 20px;
  }

  div.pedidoInfo {
    height: max-content;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;

    p,
    span {
      font-size: 16px;
    }
  }

  div.pedidoActions {
    height: max-content;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;

    button {
      height: 30px;
      width: 31%;
      color: ${colors.white};
      border: none;
      border-radius: 5px;
      font-size: 20px;
      cursor: pointer;

      :first-child {
        background-color: ${colors.green};
      }

      :nth-child(2) {
        background-color: ${colors.yellow};
      }

      :last-child {
        background-color: ${colors.red};
      }
    }
  }
`
