import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Item,
  ItensList,
  PedidosContainer,
  PedidosContent,
  PedidosMenu,
  SearchBar
} from './style'

interface OrderType {
  id: number
  tableName: string
  created_at: string
  status: 'open' | 'closed' | 'finished'
  total: number
}

export const AdmPedidos = () => {
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

  const [orders, setOrders] = useState<OrderType[]>([])
  const [search, setSearch] = useState('')

  // Endpoint único do backend
  const API_PEDIDOS = 'http://localhost/pic/admPedidos.php'

  // =============================
  // FETCH ORDERS
  // =============================
  const fetchOrders = () => {
    fetch(`${API_PEDIDOS}?action=list_orders`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error('Erro ao carregar pedidos:', data.message)
          return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalized = data.orders.map((order: any) => ({
          id: order.id,
          tableName: order.table_or_client,
          created_at: order.created_at,
          status: order.status,
          total: order.total
        }))

        console.log('PEDIDOS NORMALIZADOS:', normalized)
        setOrders(normalized)
      })
      .catch((err) => console.error('Erro ao carregar pedidos:', err))
  }

  // =============================
  // UPDATE STATUS
  // =============================
  const updateStatus = (
    id: number,
    newStatus: 'open' | 'closed' | 'finished'
  ) => {
    fetch(API_PEDIDOS, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_status',
        id,
        status: newStatus
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert('Status atualizado com sucesso!')
          fetchOrders()
        } else {
          alert(data.message || 'Erro ao atualizar status')
        }
      })
      .catch((err) => console.error('Erro ao atualizar status:', err))
  }

  // =============================
  // DELETE ORDER
  // =============================
  const deleteOrder = (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return

    fetch(API_PEDIDOS, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_order',
        id
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert('Pedido excluído com sucesso!')
          fetchOrders()
        } else {
          alert(data.message || 'Erro ao excluir pedido')
        }
      })
      .catch((err) => console.error('Erro ao excluir pedido:', err))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // =============================
  // FILTRO
  // =============================
  const filtered = orders.filter((o) =>
    o.tableName.toLowerCase().includes(search.toLowerCase())
  )

  const openOrders = filtered.filter((o) => o.status === 'open')
  const closedOrders = filtered.filter((o) => o.status === 'closed')
  const finishedOrders = filtered.filter((o) => o.status === 'finished')

  return (
    <Container>
      <PedidosMenu>
        <SearchBar>
          <label htmlFor="pesquisar">
            <i className="bi bi-search"></i>
          </label>
          <input
            type="text"
            id="pesquisar"
            placeholder="Pesquisar mesa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBar>
      </PedidosMenu>

      <PedidosContainer>
        {/* ====================== ABERTOS ====================== */}
        <PedidosContent className="ocupado">
          <div>
            <h3>
              Pedidos Abertos <i className="bi bi-door-open"></i>
            </h3>
          </div>

          <ItensList>
            {openOrders.map((order) => (
              <Item key={order.id} className="mesa-aberta">
                <h4>
                  <i className="bi bi-house"></i>
                  {order.tableName}
                </h4>

                <div className="pedidoInfo">
                  <p>Valor Total:</p>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>

                <hr />

                <div className="pedidoActions">
                  <button>Editar</button>

                  <button onClick={() => updateStatus(order.id, 'closed')}>
                    Fechar
                  </button>

                  <button onClick={() => deleteOrder(order.id)}>Excluir</button>
                </div>
              </Item>
            ))}
          </ItensList>
        </PedidosContent>

        {/* ====================== FECHADOS ====================== */}
        <PedidosContent className="fechado">
          <div>
            <h3>
              Pedidos Fechados <i className="bi bi-door-closed"></i>
            </h3>
          </div>

          <ItensList>
            {closedOrders.map((order) => (
              <Item key={order.id} className="mesa-fechada">
                <h4>
                  <i className="bi bi-house"></i> Mesa {order.tableName}
                </h4>

                <div className="pedidoInfo">
                  <p>Valor Total:</p>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>

                <hr />

                <div className="pedidoActions">
                  <button onClick={() => updateStatus(order.id, 'finished')}>
                    Concluir
                  </button>

                  <button onClick={() => deleteOrder(order.id)}>Excluir</button>
                </div>
              </Item>
            ))}
          </ItensList>
        </PedidosContent>

        {/* ====================== FINALIZADOS ====================== */}
        <PedidosContent className="finalizado">
          <div>
            <h3>
              Pedidos Concluídos <i className="bi bi-check2-circle"></i>
            </h3>
          </div>

          <ItensList>
            {finishedOrders.map((order) => (
              <Item key={order.id} className="mesa-finalizada">
                <h4>
                  <i className="bi bi-house"></i> Mesa {order.tableName}
                </h4>

                <div className="pedidoInfo">
                  <p>Valor Total:</p>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>

                <hr />

                <div className="pedidoActions">
                  <button onClick={() => deleteOrder(order.id)}>
                    Finalizar
                  </button>
                </div>
              </Item>
            ))}
          </ItensList>
        </PedidosContent>
      </PedidosContainer>
    </Container>
  )
}
