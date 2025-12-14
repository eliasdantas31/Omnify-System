import styled from 'styled-components'
import { mainTheme as theme } from '../../styles/theme'

const { colors } = theme

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 15px;
`

export const GarcomMenu = styled.div`
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 10px;

  button {
    height: 100%;
    border: none;
    font-family: 'Lilita One', sans-serif;
    font-size: 40px;
    font-weight: normal;
    border-radius: 10px;
    cursor: pointer;
    color: ${colors.white};
  }

  .pedido {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 40px;
    background-color: ${colors.red};
    border-radius: 20px 0px 0px 20px;

    @media screen and (max-width: 1024px) {
      font-size: 35px;
    }

    @media screen and (max-width: 768px) {
      padding-left: 20px;
      font-size: 25px;
    }
  }

  .finalizar {
    width: 60%;
    background-color: ${colors.yellow};
    border-radius: 0px 20px 20px 0px;

    @media screen and (max-width: 1024px) {
      font-size: 35px;
    }

    @media screen and (max-width: 768px) {
      font-size: 25px;
    }
  }
`

export const SearchBar = styled.div`
  width: 100%;
  display: flex;
  background-color: ${colors.white};
  color: ${colors.black};
  border-radius: 10px;
  margin-top: 15px;
  padding: 8px 12px;
  align-items: center;
  gap: 10px;

  input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 18px;
    background: transparent;
    font-family: 'Lilita One', sans-serif;
  }
`

export const CategoriasContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`

export const CategoriaBox = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  h3 {
    font-family: 'Lilita One', sans-serif;
    font-size: 26px;
    color: ${colors.black};
  }
`

export const PainelItens = styled.div`
  width: 100%;
  background: ${colors.white};
  border-radius: 12px;
  margin-top: -5px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const ItemLinha = styled.div`
  width: 100%;
  background: ${colors.white};
  border-radius: 12px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: 24px;
    font-family: 'Lilita One', sans-serif;
    color: ${colors.red};
  }

  button {
    background: ${colors.red};
    color: ${colors.white};
    font-family: 'Lilita One', sans-serif;
    font-size: 16px;
    border: none;
    padding: 8px 18px;
    border-radius: 8px;
    cursor: pointer;
  }
`

/* ========================= */
/* 🟥 MODAL DE EDIÇÃO */
/* ========================= */

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`

export const ModalContent = styled.div`
  background: ${colors.white};
  width: 90%;
  max-width: 420px;
  padding: 20px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  h2 {
    font-family: 'Lilita One';
    color: ${colors.red};
    font-size: 26px;
    text-align: center;
  }
`

export const OptionButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-family: 'Lilita One';
  font-size: 20px;
  background: ${colors.white};
  border: 2px solid ${colors.red};
  color: ${colors.red};
  cursor: pointer;
`

export const CloseButton = styled.button`
  width: 100%;
  padding: 15px;
  background: ${colors.red};
  border: none;
  border-radius: 10px;
  color: ${colors.white};
  font-family: 'Lilita One';
  font-size: 22px;
  cursor: pointer;
  margin-top: 10px;
`
