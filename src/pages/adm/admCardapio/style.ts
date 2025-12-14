import styled from 'styled-components'
import { mainTheme as theme } from '../../../styles/theme'

const { colors } = theme

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`

export const CardapioMenu = styled.div`
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

export const CardapioOptions = styled.div`
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

export const NewCategory = styled.button`
  height: 50px;
  width: 255px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.red};
  color: ${colors.white};
  font-family: 'Lilita One', sans-serif;
  font-size: 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`

// estilização category
export const CategoryContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  margin-top: 20px;

  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.lightGray};
    border-radius: 3px;
  }
`

export const Category = styled.div`
  height: max-content;
  width: 100%;
  padding: 22px;
  background-color: ${colors.white};
  color: ${colors.black};
  font-family: 'Lilita One', sans-serif;
  border: none;
  border-radius: 10px;
  cursor: default;
`

export const CategoryPopUpContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`

export const CategoryPopUpContent = styled.form`
  height: max-content;
  width: 500px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${colors.lightGray};

  @media screen and (max-width: 768px) {
    width: 90vw;
  }

  h3 {
    font-family: 'Lilita One', sans-serif;
    font-size: 30px;
    font-weight: normal;
    cursor: default;
    margin-bottom: 15px;
  }

  input,
  button {
    height: 40px;
    width: 100%;
    margin-bottom: 30px;
    padding: 10px;
    border: none;
    background-color: ${colors.white};
    color: ${colors.black};
    font-family: 'Lilita One', sans-serif;
    font-size: 20px;
    font-weight: normal;
    border-radius: 5px;
    cursor: pointer;
  }

  div {
    height: max-content;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    border-radius: 10px;

    button {
      background-color: ${colors.yellow};
      color: ${colors.white};
      margin: 0;
    }

    button:last-child {
      background-color: ${colors.red};
    }
  }
`

export const CategoryOptions = styled.div`
  height: max-content;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    h3 {
      font-size: 25px;
      margin-bottom: 10px;
    }

    .addItem {
      margin: 0;
    }

    button {
      background: transparent;
      border: none;
      margin-left: 20px;
      font-size: 25px;
      cursor: pointer;

      i#addItem {
        font-size: 20px;
      }

      i#dropDown {
        font-size: 45px;
        color: ${colors.yellow};
      }
    }
  }
`

// estilização item
type ItemContainerProps = {
  $open?: boolean
}

export const ItemContainer = styled.div<ItemContainerProps>`
  width: 100%;
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`

export const Item = styled.div`
  height: max-content;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px;
  background-color: ${colors.white};
  color: ${colors.black};
  font-family: 'Lilita One', sans-serif;
  border: none;
  border-radius: 10px;
  cursor: default;

  div {
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 30px;

    h3 {
      font-size: 25px;
      margin: 0;

      .itemName,
      .itemPrice {
        color: ${colors.yellow};
      }
    }

    button {
      background: transparent;
      border: none;
      cursor: pointer;

      i {
        font-size: 24px;
        color: ${colors.red};
      }
    }
  }
`
