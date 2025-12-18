import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CardapioMenu,
  CardapioOptions,
  Category,
  CategoryContainer,
  CategoryOptions,
  Container,
  NewCategory,
  SearchBar,
  ItemContainer,
  Item,
  CategoryPopUpContainer,
  CategoryPopUpContent
} from './style'

interface ItemType {
  id: number
  name: string
  price: number
  categoryId: number
}

interface AddType {
  id: number
  name: string
  price: number
}

interface CategoryType {
  id: number
  name: string
  items: ItemType[]
  adds: AddType[]
}

export const AdmCardapio = () => {
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

  const [categories, setCategories] = useState<CategoryType[]>([])
  const [openCategories, setOpenCategories] = useState<number[]>([])
  const [showCategory, setShowCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const [showItem, setShowItem] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  )

  const [editItem, setEditItem] = useState<ItemType | null>(null)
  const [editItemName, setEditItemName] = useState('')
  const [editItemPrice, setEditItemPrice] = useState('')

  // URL única do backend
  const API_CARDAPIO = 'http://localhost/pic/admCardapio.php'

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = () => {
    fetch(`${API_CARDAPIO}?action=list_menu`)
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalized = data.map((cat: any) => ({
          ...cat,
          items: cat.items || [],
          adds: cat.adds || []
        }))
        console.log('CATEGORIAS NORMALIZADAS:', normalized)
        setCategories(normalized)
      })
      .catch((err) => console.error(err))
  }

  const toggleCategory = (id: number) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return alert('Nome é obrigatório')

    fetch(API_CARDAPIO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_category',
        name: newCategoryName
      })
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || 'Operação concluída')
        setShowCategory(false)
        setNewCategoryName('')
        fetchCategories()
      })
      .catch((err) => console.error(err))
  }

  const handleCreateItem = () => {
    if (!newItemName.trim() || !newItemPrice.trim())
      return alert('Nome e preço são obrigatórios')
    if (!selectedCategoryId) return

    const price = parseFloat(newItemPrice)
    if (isNaN(price)) return alert('Preço inválido')

    fetch(API_CARDAPIO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_item',
        categoryId: selectedCategoryId,
        name: newItemName,
        price
      })
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || 'Operação concluída')
        setShowItem(false)
        setNewItemName('')
        setNewItemPrice('')
        setSelectedCategoryId(null)
        fetchCategories()
      })
      .catch((err) => console.error(err))
  }

  const abrirEdicao = (item: ItemType, categoryId: number) => {
    setEditItem({ ...item, categoryId })
    setEditItemName(item.name)
    setEditItemPrice(item.price.toString())
  }

  const salvarEdicao = () => {
    if (!editItem || !editItemName.trim() || !editItemPrice.trim())
      return alert('Nome e preço obrigatórios')

    const price = parseFloat(editItemPrice)
    if (isNaN(price)) return alert('Preço inválido')

    fetch(API_CARDAPIO, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_item',
        id: editItem.id,
        categoryId: editItem.categoryId,
        name: editItemName,
        price
      })
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || 'Operação concluída')
        setEditItem(null)
        setEditItemName('')
        setEditItemPrice('')
        fetchCategories()
      })
      .catch((err) => console.error(err))
  }

  const deletarCategoria = async (categoryId: number) => {
    try {
      const response = await fetch(API_CARDAPIO, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_category',
          id: categoryId
        })
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erro ao deletar categoria')
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
      alert('Categoria deletada com sucesso!')
    } catch (err) {
      console.error('Erro ao apagar categoria:', err)
      alert('Erro ao apagar categoria')
    }
  }

  const deletarItem = async (itemId: number, categoryId: number) => {
    try {
      const response = await fetch(API_CARDAPIO, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_item',
          id: itemId
        })
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erro ao deletar item')
      }

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
            : cat
        )
      )
      alert('Item deletado com sucesso!')
    } catch (err) {
      console.error('Erro ao apagar item:', err)
      alert('Erro ao apagar item')
    }
  }

  return (
    <Container>
      <CardapioMenu>
        <SearchBar>
          <label htmlFor="pesquisar">
            <i className="bi bi-search"></i>
          </label>
          <input type="text" id="pesquisar" placeholder="Pesquisar" />
        </SearchBar>
        <div>
          <CardapioOptions>
            <button>
              Cardápio Local
              <i className="bi bi-caret-down-fill"></i>
            </button>
            <div>
              <button id="cOnline">Cardápio Online</button>
              <button id="cLocal">Cardápio Local</button>
            </div>
          </CardapioOptions>
          <NewCategory onClick={() => setShowCategory(true)}>
            Nova Categoria
          </NewCategory>
        </div>
      </CardapioMenu>

      <CategoryContainer>
        {categories.map((cat) => (
          <Category key={cat.id}>
            <CategoryOptions>
              <div>
                <h3>{cat.name}</h3>
                <button
                  onClick={() => {
                    setSelectedCategoryId(cat.id)
                    setShowItem(true)
                  }}
                  className="addItem"
                >
                  <i className="bi bi-plus-circle"></i> Adicionar item
                </button>
              </div>
              <div>
                <button>
                  <i
                    className="bi bi-trash"
                    onClick={() => deletarCategoria(cat.id)}
                  ></i>
                </button>
                <button onClick={() => toggleCategory(cat.id)}>
                  <i
                    className={
                      openCategories.includes(cat.id)
                        ? 'bi bi-caret-up-fill'
                        : 'bi bi-caret-down-fill'
                    }
                  ></i>
                </button>
              </div>
            </CategoryOptions>

            <ItemContainer $open={openCategories.includes(cat.id)}>
              {cat.items.map((item) => (
                <Item key={item.id}>
                  <div>
                    <h3>
                      <span className="itemName">Nome: </span>
                      <span>{item.name}</span>
                    </h3>
                    <h3>
                      <span className="itemPrice">Valor: </span>
                      <span>R${item.price.toFixed(2)}</span>
                    </h3>
                  </div>
                  <div>
                    <button onClick={() => abrirEdicao(item, cat.id)}>
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button>
                      <i
                        className="bi bi-trash"
                        onClick={() => deletarItem(item.id, cat.id)}
                      ></i>
                    </button>
                  </div>
                </Item>
              ))}
              {cat.adds.length > 0 && (
                <div>
                  <strong>Adicionais:</strong>
                  {cat.adds.map((add) => (
                    <div key={add.id}>
                      {add.name} - R${add.price.toFixed(2)}
                    </div>
                  ))}
                </div>
              )}
            </ItemContainer>
          </Category>
        ))}
      </CategoryContainer>

      {/* nova categoria */}
      {showCategory && (
        <CategoryPopUpContainer>
          <CategoryPopUpContent>
            <h3>Criar nova categoria</h3>
            <input
              type="text"
              placeholder="Nome da categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
            <div>
              <button onClick={handleCreateCategory}>Criar</button>
              <button onClick={() => setShowCategory(false)}>Cancelar</button>
            </div>
          </CategoryPopUpContent>
        </CategoryPopUpContainer>
      )}

      {/* novo item */}
      {showItem && (
        <CategoryPopUpContainer>
          <CategoryPopUpContent>
            <h3>Criar novo item</h3>
            <input
              type="text"
              placeholder="Nome do item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Preço do item"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
            />
            <div>
              <button onClick={handleCreateItem}>Criar</button>
              <button
                onClick={() => {
                  setShowItem(false)
                  setSelectedCategoryId(null)
                }}
              >
                Cancelar
              </button>
            </div>
          </CategoryPopUpContent>
        </CategoryPopUpContainer>
      )}

      {/* edição de item */}
      {editItem && (
        <CategoryPopUpContainer>
          <CategoryPopUpContent>
            <h3>Editar item</h3>
            <input
              type="text"
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
              placeholder="Nome do item"
            />
            <input
              type="number"
              value={editItemPrice}
              onChange={(e) => setEditItemPrice(e.target.value)}
              placeholder="Preço do item"
            />
            <div>
              <button onClick={salvarEdicao}>Salvar</button>
              <button
                onClick={() => {
                  setEditItem(null)
                  setEditItemName('')
                  setEditItemPrice('')
                }}
              >
                Cancelar
              </button>
            </div>
          </CategoryPopUpContent>
        </CategoryPopUpContainer>
      )}
    </Container>
  )
}
