import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../../components/Header'

import {
  Container,
  SearchBar,
  CategoriaBox,
  CategoriasContainer,
  PainelItens,
  ItemLinha,
  ModalOverlay,
  ModalContent,
  OptionButton,
  CloseButton,
  GarcomMenu
} from './style'

interface Item {
  id: number
  name: string
  price: number
}

interface Add {
  id: number
  name: string
  price: number
}

interface Category {
  id: number
  name: string
  items: Item[]
  adds: Add[]
}

interface OrderItem {
  id: number
  itemId: number
  name: string
  quantity: number
  price: number
  subtotal: number
  observations: string
}

interface CurrentOrder {
  id: number
  table_name: string
  status: string
  items: OrderItem[]
  total: number
}

export const GarcomCategoria = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      navigate('/loginPage')
      return
    }

    const user = JSON.parse(stored)
    if (user.role !== 'G') {
      navigate('/loginPage')
      return
    }

    const savedOrderId = localStorage.getItem('currentOrderId')
    if (savedOrderId) {
      loadCurrentOrder(parseInt(savedOrderId))
    } else {
      alert('Nenhum pedido ativo. Crie um novo pedido primeiro.')
      navigate('/garcom') // ou '/garcomPage', conforme sua rota
    }
  }, [navigate])

  const [categoriaAberta, setCategoriaAberta] = useState<number | null>(null)
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')

  // Estado do pedido atual
  const [currentOrder, setCurrentOrder] = useState<CurrentOrder | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [observations, setObservations] = useState('')

  // Endpoints
  const API_CARDAPIO = 'http://localhost/pic/admCardapio.php'
  const API_PEDIDO = 'http://localhost/pic/garcomPedido.php'

  // Carrega categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_CARDAPIO}?action=list_menu`)
        const data = await res.json()

        if (data.success) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const normalized = data.categories.map((cat: any) => ({
            ...cat,
            items: cat.items || [],
            adds: cat.adds || []
          }))
          setCategories(normalized)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchCategories()
  }, [])

  // Cria pedido ao carregar (ou recupera existente do localStorage)
  useEffect(() => {
    const savedOrderId = localStorage.getItem('currentOrderId')

    if (savedOrderId) {
      loadCurrentOrder(parseInt(savedOrderId))
    } else {
      alert('Nenhum pedido ativo. Crie um novo pedido primeiro.')
      navigate('/garcomPage') // ou '/garcom', conforme suas rotas
    }
  }, [])

  const createNewOrder = async () => {
    const tableName = prompt('Digite o nome/número da mesa:')
    if (!tableName) return

    try {
      const res = await fetch(API_PEDIDO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_order',
          table_name: tableName
        })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('currentOrderId', data.order.id.toString())
        loadCurrentOrder(data.order.id)
      } else {
        alert(data.message || 'Erro ao criar pedido')
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao criar pedido')
    }
  }

  const loadCurrentOrder = async (orderId: number) => {
    try {
      const res = await fetch(API_PEDIDO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_current_order',
          order_id: orderId
        })
      })

      const data = await res.json()

      if (data.success) {
        setCurrentOrder(data.order)
      } else {
        console.error(data.message)
        localStorage.removeItem('currentOrderId')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleCategoria = (catId: number) => {
    setCategoriaAberta((prev) => (prev === catId ? null : catId))
  }

  const abrirEdicao = (item: Item) => {
    setItemSelecionado(item)
    setObservations('')
    setModalAberto(true)
  }

  const adicionarItem = async () => {
    if (!currentOrder || !itemSelecionado) return

    try {
      const res = await fetch(API_PEDIDO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_item',
          order_id: currentOrder.id,
          item_id: itemSelecionado.id,
          quantity: 1,
          observations
        })
      })

      const data = await res.json()

      if (data.success) {
        alert('Item adicionado ao pedido!')
        loadCurrentOrder(currentOrder.id)
        setModalAberto(false)
        setItemSelecionado(null)
        setObservations('')
      } else {
        alert(data.message || 'Erro ao adicionar item')
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao adicionar item')
    }
  }

  const removerItem = async (orderItemId: number) => {
    if (!currentOrder) return
    if (!confirm('Remover este item do pedido?')) return

    try {
      const res = await fetch(API_PEDIDO, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove_item',
          order_item_id: orderItemId
        })
      })

      const data = await res.json()

      if (data.success) {
        alert('Item removido!')
        loadCurrentOrder(currentOrder.id)
      } else {
        alert(data.message || 'Erro ao remover item')
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao remover item')
    }
  }

  const finalizarPedido = async () => {
    if (!currentOrder) return
    if (!confirm('Finalizar este pedido?')) return

    try {
      const res = await fetch(API_PEDIDO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'finalize_order',
          order_id: currentOrder.id
        })
      })

      const data = await res.json()

      if (data.success) {
        alert('Pedido finalizado com sucesso!')
        localStorage.removeItem('currentOrderId')
        setCurrentOrder(null)
        createNewOrder()
      } else {
        alert(data.message || 'Erro ao finalizar pedido')
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao finalizar pedido')
    }
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Container>
      <Header $variant="garcom" />

      <GarcomMenu>
        <button className="pedido" onClick={() => setShowOrderModal(true)}>
          Ver Pedido Atual
        </button>
        <button className="finalizar" onClick={finalizarPedido}>
          Finalizar
        </button>
      </GarcomMenu>

      <SearchBar>
        <i className="bi bi-search"></i>
        <input
          placeholder="Pesquisar categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      <CategoriasContainer>
        {filteredCategories.map((cat) => (
          <div key={cat.id} style={{ width: '100%' }}>
            <CategoriaBox onClick={() => toggleCategoria(cat.id)}>
              <h3>{cat.name}</h3>
              <span style={{ fontSize: '24px' }}>
                {categoriaAberta === cat.id ? '▲' : '▼'}
              </span>
            </CategoriaBox>

            {categoriaAberta === cat.id && (
              <PainelItens>
                {cat.items.map((item) => (
                  <ItemLinha key={item.id}>
                    <p>{item.name}</p>
                    <p>R$ {item.price.toFixed(2)}</p>
                    <button onClick={() => abrirEdicao(item)}>ADICIONAR</button>
                  </ItemLinha>
                ))}

                {cat.adds.length > 0 && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '10px',
                      background: '#f5f5f5'
                    }}
                  >
                    <strong>Adicionais disponíveis:</strong>
                    {cat.adds.map((add) => (
                      <div key={add.id} style={{ marginLeft: '10px' }}>
                        • {add.name} - R$ {add.price.toFixed(2)}
                      </div>
                    ))}
                  </div>
                )}
              </PainelItens>
            )}
          </div>
        ))}
      </CategoriasContainer>

      {/* MODAL DE ADICIONAR ITEM */}
      {modalAberto && itemSelecionado && (
        <ModalOverlay>
          <ModalContent>
            <h2>{itemSelecionado.name}</h2>
            <p>R$ {itemSelecionado.price.toFixed(2)}</p>

            <div style={{ marginTop: '20px' }}>
              <label>Observações:</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex: sem cebola, ponto da carne, etc."
                style={{ width: '100%', minHeight: '80px', padding: '10px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <CloseButton onClick={() => setModalAberto(false)}>
                Cancelar
              </CloseButton>
              <OptionButton onClick={adicionarItem}>
                Adicionar ao Pedido
              </OptionButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* MODAL DO PEDIDO ATUAL */}
      {showOrderModal && currentOrder && (
        <ModalOverlay>
          <ModalContent>
            <h2>Pedido Atual - {currentOrder.table_name}</h2>

            {currentOrder.items.length === 0 ? (
              <p>Nenhum item no pedido ainda.</p>
            ) : (
              <div>
                {currentOrder.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px',
                      borderBottom: '1px solid #ddd'
                    }}
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <br />
                      <small>
                        Qtd: {item.quantity} x R$ {item.price.toFixed(2)}
                      </small>
                      {item.observations && (
                        <>
                          <br />
                          <small style={{ color: '#666' }}>
                            Obs: {item.observations}
                          </small>
                        </>
                      )}
                    </div>
                    <div>
                      <strong>R$ {item.subtotal.toFixed(2)}</strong>
                      <br />
                      <button
                        onClick={() => removerItem(item.id)}
                        style={{ fontSize: '12px', color: 'red' }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <h3>Total: R$ {currentOrder.total.toFixed(2)}</h3>
                </div>
              </div>
            )}

            <CloseButton onClick={() => setShowOrderModal(false)}>
              Fechar
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}

export default GarcomCategoria
