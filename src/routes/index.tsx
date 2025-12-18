import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from '../pages/loginPage'
import CadastroGeral from '../pages/cadastroGeral'

import { AdmPage } from '../pages/adm/admPage'
import { AdmLayout } from '../pages/adm/admLayout'
import { AdmPedidos } from '../pages/adm/admPedidos'
import { AdmGarcom } from '../pages/adm/admGarcom'
import { AdmCardapio } from '../pages/adm/admCardapio'
import { AdmConfig } from '../pages/adm/admConfig'

import { GarcomPage } from '../pages/garcom/garcomPage'
import { GarcomCategoria } from '../pages/garcom/garcomCategoria'

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Rota raiz redireciona para login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rota de Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/loginPage" element={<Navigate to="/login" replace />} />

      {/* Rota do Manager - Cadastro Geral (role 'M') */}
      <Route path="/cadastroGeral" element={<CadastroGeral />} />

      {/* Rotas do Administrador (role 'A') */}
      <Route path="/adm" element={<AdmPage />} />

      {/* ROTAS ADM ANINHADAS - Layout com Menu + Footer */}
      <Route path="/adm/layout" element={<AdmLayout />}>
        <Route path="pedidos" element={<AdmPedidos />} />
        <Route path="garcom" element={<AdmGarcom />} />
        <Route path="cardapio" element={<AdmCardapio />} />
        <Route path="config" element={<AdmConfig />} />
        {/* Redireciona /adm/layout para /adm/layout/pedidos por padrão */}
        <Route index element={<Navigate to="pedidos" replace />} />
      </Route>

      {/* Rotas do Garçom (role 'G') */}
      <Route path="/garcom" element={<GarcomPage />} />
      <Route path="/garcomPage" element={<Navigate to="/garcom" replace />} />
      <Route path="/garcomCategoria" element={<GarcomCategoria />} />

      {/* Rota do Usuário comum (role 'U') - você pode criar depois */}
      <Route
        path="/usuario"
        element={
          <div style={{ padding: '2rem' }}>
            <h1>Página do Usuário</h1>
            <p>Em desenvolvimento...</p>
          </div>
        }
      />

      {/* Rota 404 - Página não encontrada */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
)
