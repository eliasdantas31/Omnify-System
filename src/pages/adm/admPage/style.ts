import styled from 'styled-components'
import { mainTheme as theme } from '../../../styles/theme'

const { colors } = theme

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  padding: 21px 100px;
`

export const OptionsContainer = styled.div`
  height: max-content;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: 21px 0;
  gap: 21px;
  justify-content: center;
  align-items: center;
`

type OptionCardProps = {
  $largura?: string
  $bgColor?: keyof typeof colors // 'red' | 'yellow' | 'white' | ...
}

export const OptionCard = styled.button<OptionCardProps>`
  height: 250px;
  width: ${({ $largura }) => $largura || '842px'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lilita One', sans-serif;
  font-size: 38px;
  font-weight: normal;
  border-radius: 20px;
  cursor: pointer;
  color: ${colors.white};
  background-color: ${({ $bgColor }) =>
    $bgColor ? colors[$bgColor] : colors.red};
  border: none;
  transition: all 0.3s ease;

  & > i {
    font-size: 170px;
  }

  &:hover {
    transform: scale(1.02);
  }
`
