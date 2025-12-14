import { useEffect, useState } from 'react'
import {
  Container,
  HeaderLine,
  SearchBar,
  AddButton,
  FormCard,
  InputGroup,
  GarcomList,
  GarcomItem,
  ConfirmOverlay,
  ConfirmBox
} from './style'

interface User {
  id: number
  email: string
  password: string
}

export const AdmGarcom = () => {
  const [showForm, setShowForm] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [garcons, setGarcons] = useState<{ email: string }[]>([]) // (ainda não usado)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [user, setUser] = useState<User[]>([])

  const [showConfirm, setShowConfirm] = useState(false)
  const [garcomToDelete, setGarcomToDelete] = useState<number | null>(null)

  // estado da barra de pesquisa
  const [search, setSearch] = useState('')

  const handleAdd = () => {
    if (!email || !senha) {
      return alert('Preencha todos os campos!')
    }

    fetch('http://localhost/pic/public/index.php/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: senha,
        admin: 'N'
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao adicionar garçom')
        return res.json()
      })
      .then((novoUser: User) => {
        setUser((prev) => [...prev, novoUser])
        setEmail('')
        setSenha('')
        setShowForm(false)
      })
      .catch((err) => {
        console.log(err)
        alert('Erro ao adicionar garçom')
      })
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost/pic/public/index.php/users')
        const data: User[] = await res.json()
        setUser(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchUsers()
  }, [])

  const askDelete = (index: number) => {
    setGarcomToDelete(index)
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    if (garcomToDelete === null) return

    fetch(
      `http://localhost/pic/public/index.php/users/delete/${garcomToDelete}`,
      {
        method: 'DELETE'
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao excluir garçom')
        setUser((prev) => prev.filter((u) => u.id !== garcomToDelete))
        setShowConfirm(false)
        setGarcomToDelete(null)
      })
      .catch((err) => {
        console.log(err)
        alert('Erro ao excluir garçom')
      })
  }

  // lista filtrada pela searchbar
  const filteredUsers = user.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase().trim())
  )

  return (
    <Container>
      <HeaderLine>
        <SearchBar>
          <label htmlFor="pesquisar">
            <i className="bi bi-search"></i>
          </label>
          <input
            type="text"
            id="pesquisar"
            placeholder="Pesquisar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBar>

        <AddButton onClick={() => setShowForm(!showForm)}>
          <i className="bi bi-person-plus-fill"></i>
          Adicionar Garçom
        </AddButton>
      </HeaderLine>

      {showForm && (
        <FormCard>
          <h3>Novo Garçom</h3>

          <InputGroup>
            <label>Email:</label>
            <input
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <label>Senha:</label>
            <input
              type="password"
              placeholder="Digite uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </InputGroup>

          <button onClick={handleAdd}>Salvar</button>
        </FormCard>
      )}

      <GarcomList>
        {filteredUsers.map((user) => (
          <GarcomItem key={user.id}>
            <p>{user.email}</p>
            <i
              className="bi bi-trash-fill"
              onClick={() => askDelete(user.id)}
            ></i>
          </GarcomItem>
        ))}
      </GarcomList>

      {/* POP-UP DE CONFIRMAÇÃO */}
      {showConfirm && (
        <ConfirmOverlay>
          <ConfirmBox>
            <h3>Excluir garçom?</h3>
            <p>Tem certeza que deseja remover este garçom?</p>

            <div className="buttons">
              <button className="cancel" onClick={() => setShowConfirm(false)}>
                Cancelar
              </button>

              <button className="confirm" onClick={confirmDelete}>
                Excluir
              </button>
            </div>
          </ConfirmBox>
        </ConfirmOverlay>
      )}
    </Container>
  )
}
