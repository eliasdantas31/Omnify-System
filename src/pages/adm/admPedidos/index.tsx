import { useEffect, useState } from 'react'
import {
  Container,
  Item,
  ItensList,
  PedidosContainer,
  PedidosContent,
  PedidosMenu,
  PedidosOptions,
  SearchBar
} from './style'

interface OrderType {
  id: number
  tableName: string
  created_at: string
  status: 'open' | 'closed' | 'finished'
}

export const AdmPedidos = () => {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [search, setSearch] = useState('')

  // =============================
  // FETCH ORDERS
  // =============================
  const fetchOrders = () => {
    fetch('http://localhost/pic/public/index.php/orders')
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((order: any) => ({
          id: order.id,
          tableName: order.table_or_client, // <- corrigido
          created_at: order.created_at,
          status: order.status
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
    fetch(`http://localhost/pic/public/index.php/orders/status/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then((res) => res.json())
      .then(() => fetchOrders())
      .catch((err) => console.error('Erro ao atualizar status:', err))
  }

  // =============================
  // DELETE ORDER
  // =============================
  const deleteOrder = (id: number) => {
    fetch(`http://localhost/pic/public/index.php/orders/delete/${id}`, {
      method: 'DELETE'
    })
      .then((res) => res.json())
      .then(() => fetchOrders())
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
                  <span>R$ 0</span>
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
                  <span>R$ 0</span>
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
                  <span>R$ 0</span>
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
