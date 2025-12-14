import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/loginPage'
import { AdmPage } from '../pages/adm/admPage'
import { GarcomPage } from '../pages/garcom/garcomPage'
import { GarcomCategoria } from '../pages/garcom/garcomCategoria'

import { AdmLayout } from '../pages/adm/admLayout'
import { AdmPedidos } from '../pages/adm/admPedidos'
import { AdmGarcom } from '../pages/adm/admGarcom'
import { AdmCardapio } from '../pages/adm/admCardapio'
import { AdmConfig } from '../pages/adm/admConfig'

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/adm" element={<AdmPage />} />
      <Route path="/garcom" element={<GarcomPage />} />
      <Route path="/garcomCategoria" element={<GarcomCategoria />} />

      {/* ROTAS ADM ANINHADAS - Layout com Menu + Footer */}
      <Route path="/adm/layout" element={<AdmLayout />}>
        <Route path="pedidos" element={<AdmPedidos />} />
        <Route path="garcom" element={<AdmGarcom />} />
        <Route path="cardapio" element={<AdmCardapio />} />
        <Route path="config" element={<AdmConfig />} />
        {/* outras: config, robo, relatório... */}
      </Route>
    </Routes>
  </BrowserRouter>
)
