import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from './style'

export const AdmConfig = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      navigate('/loginPage')
      return
    }

    const user = JSON.parse(stored)
    if (user.role !== 'A') {
      navigate('/loginPage')
    }
  }, [navigate])

  return (
    <Container>
      <h1>Configurações</h1>
      {/* conteúdo da tela de configurações */}
    </Container>
  )
}
