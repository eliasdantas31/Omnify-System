import styled from 'styled-components'
import { mainTheme as theme } from '../../../styles/theme'

const { colors } = theme

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  padding: 21px 100px;
  background-color: ${colors.lightGray};
  display: flex;
  flex-direction: column;
`

export const Content = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
`

export const PageWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`
