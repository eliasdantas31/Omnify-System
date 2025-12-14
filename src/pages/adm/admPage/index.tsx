import { Container, OptionsContainer, OptionCard } from './style'
import { useNavigate } from 'react-router-dom'

import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'

export const AdmPage = () => {
  const navigate = useNavigate()

  return (
    <Container>
      <Header $variant="adm" />
      <OptionsContainer>
        <OptionCard
          id="pedidos"
          $bgColor="red"
          onClick={() => navigate('/adm/layout/pedidos')}
        >
          <h1>PEDIDOS</h1>
        </OptionCard>
        <OptionCard
          id="garcom"
          $bgColor="yellow"
          onClick={() => navigate('/adm/layout/garcom')}
        >
          <h1>GARÇOM</h1>
        </OptionCard>
        <OptionCard
          id="cardapio"
          $largura="1339px"
          $bgColor="yellow"
          onClick={() => navigate('/adm/layout/cardapio')}
        >
          <h1>CARDÁPIO</h1>
        </OptionCard>
        <OptionCard
          id="config"
          $largura="345px"
          $bgColor="red"
          onClick={() => alert('Em desenvolvimento')}
        >
          <i className="bi bi-gear"></i>
        </OptionCard>
        <OptionCard
          id="robo"
          $bgColor="yellow"
          onClick={() => alert('Em desenvolvimento')}
        >
          <h1>ROBÔ</h1>
        </OptionCard>
        <OptionCard
          id="relatorio"
          $bgColor="red"
          onClick={() => alert('Em desenvolvimento')}
        >
          <h1>RELATÓRIO</h1>
        </OptionCard>
      </OptionsContainer>
      <Footer $variant="default" />
    </Container>
  )
}
