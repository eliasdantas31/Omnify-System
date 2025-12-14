import { useNavigate } from 'react-router-dom'
import { MenuContainer, MenuContent, Logo, LogoContainer } from './style'

export const MenuComponent = () => {
  const navigate = useNavigate()

  return (
    <MenuContainer>
      <LogoContainer>
        <button onClick={() => navigate('/adm')}>
          <Logo />
        </button>
      </LogoContainer>
      <MenuContent>
        <ul>
          <li>
            <button onClick={() => navigate('/adm/layout/pedidos')}>
              Pedidos
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/adm/layout/garcom')}>
              Garçom
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/adm/layout/cardapio')}>
              Cardápio
            </button>
          </li>
          <li>
            <button onClick={() => alert('Em desenvolvimento')}>
              Configuração
            </button>
          </li>
          <li>
            <button onClick={() => alert('Em desenvolvimento')}>Robô</button>
          </li>
          <li>
            <button onClick={() => alert('Em desenvolvimento')}>
              Relatório
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/')}>Sair</button>
          </li>
        </ul>
      </MenuContent>
    </MenuContainer>
  )
}
