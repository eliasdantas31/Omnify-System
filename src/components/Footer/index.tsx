import * as F from './style'

type FooterProps = {
  $variant?: 'default' | 'menu'
}

export const Footer = ({ $variant = 'default' }: FooterProps) => {
  return (
    <F.FooterContainer $variant={$variant}>
      <F.InfoContainer>
        <h1>©Todos os direitos reservados BaitaKão | 2024</h1>
      </F.InfoContainer>
      <F.FooterContent>
        <h1>Powered by Omnify</h1>
      </F.FooterContent>
    </F.FooterContainer>
  )
}
