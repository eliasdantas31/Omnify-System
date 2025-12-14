import { useNavigate } from 'react-router-dom'
import * as H from './style'

type HeaderProps = {
  $variant?: 'adm' | 'garcom'
}

export const Header = ({ $variant = 'adm' }: HeaderProps) => {
  const navigate = useNavigate()

  return (
    <H.HeaderContainer $variant={$variant}>
      {/* Logo ADM */}
      <H.LogoContainer className="admLogo">
        <button onClick={() => navigate('/adm')}>
          <H.Logo />
        </button>
      </H.LogoContainer>

      {/* Logo Garçom */}
      <H.LogoContainer className="garcomLogo">
        <button onClick={() => navigate('/garcom')}>
          <H.Logo />
        </button>
      </H.LogoContainer>

      <H.HeaderContent $variant={$variant}>
        <li className="adm">
          <button id="pedidos" onClick={() => navigate('/adm/layout/pedidos')}>
            Pedidos
          </button>
        </li>
        <li className="adm">
          <button id="garcom" onClick={() => navigate('/adm/layout/garcom')}>
            Garçom
          </button>
        </li>
        <li className="adm">
          <button
            id="cardapio"
            onClick={() => navigate('/adm/layout/cardapio')}
          >
            Cardápio
          </button>
        </li>
        <li className="adm">
          <button id="config" onClick={() => alert('Em desenvolvimento')}>
            Configuração
          </button>
        </li>
        <li className="adm">
          <button id="robo" onClick={() => alert('Em desenvolvimento')}>
            Robô
          </button>
        </li>
        <li className="adm">
          <button id="relatorio" onClick={() => alert('Em desenvolvimento')}>
            Relatório
          </button>
        </li>
        <li className="adm">
          <button id="sair" onClick={() => navigate('/')}>
            Sair
          </button>
        </li>
        <li className="garcom">
          <button id="sair" onClick={() => navigate('/')}>
            Sair
          </button>
        </li>
      </H.HeaderContent>
    </H.HeaderContainer>
  )
}
