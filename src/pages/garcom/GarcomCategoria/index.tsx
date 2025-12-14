/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
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

export const GarcomCategoria = () => {
  const [categoriaAberta, setCategoriaAberta] = useState<number | null>(null)
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const opcoesEdicao = [
    '+ Adicional de queijo',
    '+ Adicional de bacon',
    '- Remover salada',
    '- Remover molho'
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          'http://localhost/pic/public/index.php/category/menu'
        )
        const data: Category[] = await res.json()
        const normalized = data.map((cat) => ({
          ...cat,
          items: cat.items || [],
          adds: cat.adds || []
        }))
        setCategories(normalized)
      } catch (err) {
        console.log(err)
      }
    }

    fetchCategories()
  }, [])

  const toggleCategoria = (catId: number) => {
    setCategoriaAberta((prev) => (prev === catId ? null : catId))
  }

  const abrirEdicao = (item: Item) => {
    setItemSelecionado(item)
    setModalAberto(true)
  }

  return (
    <Container>
      <Header $variant="garcom" />

      <GarcomMenu>
        <button className="pedido">Ver Pedido Atual</button>
        <button className="finalizar">Finalizar</button>
      </GarcomMenu>

      <SearchBar>
        <i className="bi bi-search"></i>
        <input placeholder="Pesquisar" />
      </SearchBar>

      <CategoriasContainer>
        {categories.map((cat) => (
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
                    <p>R${item.price.toFixed(2)}</p>
                    <button onClick={() => abrirEdicao(item)}>ADICIONAR</button>
                  </ItemLinha>
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
              </PainelItens>
            )}
          </div>
        ))}
      </CategoriasContainer>

      {/* MODAL DE EDIÇÃO */}
      {modalAberto && itemSelecionado && (
        <ModalOverlay>
          <ModalContent>
            <h2>Editando: {itemSelecionado.name}</h2>
            {opcoesEdicao.map((op) => (
              <OptionButton key={op}>{op}</OptionButton>
            ))}
            <CloseButton onClick={() => setModalAberto(false)}>
              Concluir
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}

export default GarcomCategoria
