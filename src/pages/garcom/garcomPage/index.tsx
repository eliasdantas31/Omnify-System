import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Header } from '../../../components/Header'

import {
  Container,
  GarcomContainer,
  NovoPedido,
  TableInfo,
  TablesContainer,
  Table,
  PopUpContainer,
  PopUpContent
} from './style'

interface Order {
  id: number
  table_or_client: string
  status: 'open' | 'closed' | 'finished'
  total: number
}

export const GarcomPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      navigate('/loginPage')
      return
    }

    const user = JSON.parse(stored)
    if (user.role !== 'G') {
      alert('Acesso permitido apenas para garçons.')
      navigate('/loginPage')
    }
  }, [navigate])

  const [showPopup, setShowPopup] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [tableNumber, setTableNumber] = useState('')

  // Endpoint único
  const API_PEDIDO = 'http://localhost/pic/garcomPedido.php'
  const API_PEDIDOS_LIST = 'http://localhost/pic/admPedidos.php'

  // ============================================================
  // FETCH ORDERS - apenas pedidos abertos (open)
  // ============================================================
  const fetchOrders = () => {
    fetch(`${API_PEDIDOS_LIST}?action=list_orders`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Filtra apenas pedidos abertos para o garçom
          const openOrders = data.orders.filter(
            (order: Order) => order.status === 'open'
          )
          console.log('PEDIDOS ABERTOS:', openOrders)
          setOrders(openOrders)
        } else {
          console.error('Erro ao buscar pedidos:', data.message)
        }
      })
      .catch((err) => console.error('FETCH ERROR:', err))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // ============================================================
  // CRIAR NOVO PEDIDO
  // ============================================================
  const handleAdicionar = () => {
    if (!tableNumber.trim()) {
      alert('Informe o número ou nome da mesa.')
      return
    }

    fetch(API_PEDIDO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_order',
        table_name: tableNumber.trim()
      })
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          console.log('Novo pedido criado:', response.order)
          alert(`Pedido criado para ${tableNumber}!`)

          // Salva o ID do pedido no localStorage para o GarcomCategoria usar
          localStorage.setItem('currentOrderId', response.order.id.toString())

          // Reset form e fechar popup
          setShowPopup(false)
          setTableNumber('')

          // Atualizar lista de pedidos
          fetchOrders()

          // Navega para a página de categorias
          navigate('/garcomCategoria')
        } else {
          alert(response.message || 'Erro ao criar pedido')
        }
      })
      .catch((err) => {
        console.error('ERRO AO CRIAR PEDIDO:', err)
        alert('Erro ao criar pedido')
      })
  }

  const handleExibir = (orderId: number) => {
    // Salva o ID do pedido no localStorage
    localStorage.setItem('currentOrderId', orderId.toString())
    navigate('/garcomCategoria')
  }

  // Separa pedidos por status para exibição visual
  const openOrders = orders.filter((o) => o.status === 'open')

  return (
    <Container>
      <Header $variant="garcom" />

      <GarcomContainer>
        <NovoPedido>
          <h1>Pedidos</h1>
          <button onClick={() => setShowPopup(true)}>Novo pedido</button>
        </NovoPedido>

        <TableInfo>
          <div>
            <div className="ocupada"></div>
            <p>Aberta</p>
          </div>
          <div>
            <div className="fechada"></div>
            <p>Fechada</p>
          </div>
        </TableInfo>

        <TablesContainer>
          {openOrders.length === 0 && <p>Nenhum pedido aberto.</p>}

          {openOrders.map((order) => (
            <Table key={order.id} className={order.status}>
              <h3>{order.table_or_client}</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Total: R$ {order.total.toFixed(2)}
              </p>
              <button onClick={() => handleExibir(order.id)}>EXIBIR</button>
            </Table>
          ))}
        </TablesContainer>
      </GarcomContainer>

      <PopUpContainer $show={showPopup}>
        <PopUpContent>
          <h2>Novo Pedido</h2>

          <input
            type="text"
            placeholder="Número/Nome da Mesa"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAdicionar()
            }}
          />

          <div>
            <button onClick={handleAdicionar}>ADICIONAR</button>
            <button onClick={() => setShowPopup(false)}>CANCELAR</button>
          </div>
        </PopUpContent>
      </PopUpContainer>
    </Container>
  )
}

export default GarcomPage
