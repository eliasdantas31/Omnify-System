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

export const GarcomPage = () => {
  const navigate = useNavigate()

  const [showPopup, setShowPopup] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [tableNumber, setTableNumber] = useState('')
  const [observation, setObservation] = useState('')

  // ============================================================
  // FETCH ORDERS
  // ============================================================
  const fetchOrders = () => {
    fetch('http://localhost/pic/public/index.php/orders')
      .then((res) => res.json())
      .then((data) => {
        console.log('ORDERS RECEBIDAS:', data)
        setOrders(data) // já vem com table_number e status do backend
      })
      .catch((err) => console.error('FETCH ERROR:', err))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // ============================================================
  // CRIAR NOVO PEDIDO — POST /orders/create
  // ============================================================
  const handleAdicionar = () => {
    if (!tableNumber) {
      alert('Informe o número ou nome da mesa.')
      return
    }

    const payload = {
      table_or_client: tableNumber,
      observation: observation
    }

    console.log('Payload que será enviado:', payload)

    fetch('http://localhost/pic/public/index.php/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((response) => {
        console.log('Novo pedido criado:', response)

        // Reset form e fechar popup
        setShowPopup(false)
        setTableNumber('')
        setObservation('')

        // Atualizar lista de pedidos
        //fetchOrders()
      })
      .catch((err) => console.error('ERRO AO CRIAR PEDIDO:', err))
  }

  const handleExibir = (orderId: number) => {
    navigate(`/garcomCategoria?id=${orderId}`)
  }

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
            <div className="fechada"></div>
            <p>Ocupada</p>
          </div>
          <div>
            <div className="ocupada"></div>
            <p>Fechada</p>
          </div>
        </TableInfo>

        <TablesContainer>
          {orders.length === 0 && <p>Nenhum pedido encontrado.</p>}

          {orders.map((order) => (
            <Table key={order.id}>
              <h3>{order.table_or_client}</h3>
              <button onClick={() => handleExibir(order.id)}>EXIBIR</button>
            </Table>
          ))}
        </TablesContainer>
      </GarcomContainer>

      <PopUpContainer $show={showPopup}>
        <PopUpContent>
          <input
            type="text"
            placeholder="Número/Nome da Mesa"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />

          <input
            type="text"
            placeholder="Observação:"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
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
