import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Outlet } from 'react-router-dom'
import { Container, Content, PageWrapper } from './style'

import { MenuComponent } from '../../../components/MenuComponet'
import { Footer } from '../../../components/Footer'

export const AdmLayout = () => {
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
      <Content>
        <MenuComponent />
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </Content>

      <Footer $variant="menu" />
    </Container>
  )
}
