import { Outlet } from 'react-router-dom'
import { Container, Content, PageWrapper } from './style'

import { MenuComponent } from '../../components/MenuComponet'
import { Footer } from '../../components/Footer'

export const AdmLayout = () => {
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
