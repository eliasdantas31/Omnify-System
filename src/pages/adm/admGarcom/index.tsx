import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  role: string // 'G'
}

export const AdmGarcom = () => {
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

  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [user, setUser] = useState<User[]>([])

  const [showConfirm, setShowConfirm] = useState(false)
  const [garcomToDelete, setGarcomToDelete] = useState<number | null>(null)

  const [search, setSearch] = useState('')

  // Endpoint único do backend
  const API_GARCOM = 'http://localhost/pic/admGarcom.php'
  // Em produção você pode trocar para '/pic/admGarcom.php' se React e PHP estiverem no mesmo domínio

  const handleAdd = () => {
    if (!email || !senha) {
      return alert('Preencha todos os campos!')
    }

    fetch(API_GARCOM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_garcom',
        email,
        password: senha
      })
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.success) {
          alert(result.message || 'Erro ao adicionar garçom')
          return
        }

        const novoUser: User = result.user
        setUser((prev) => [...prev, novoUser])
        setEmail('')
        setSenha('')
        setShowForm(false)
        alert('Garçom criado com sucesso!')
      })
      .catch((err) => {
        console.log(err)
        alert('Erro ao adicionar garçom')
      })
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_GARCOM}?action=list_users`)
        const data = await res.json()

        if (data.success) {
          setUser(data.users)
        } else {
          console.log('Erro ao buscar usuários:', data.message)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchUsers()
  }, [])

  const askDelete = (id: number) => {
    setGarcomToDelete(id)
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    if (garcomToDelete === null) return

    fetch(API_GARCOM, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_user',
        id: garcomToDelete
      })
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.success) {
          alert(result.message || 'Erro ao excluir garçom')
          return
        }

        setUser((prev) => prev.filter((u) => u.id !== garcomToDelete))
        setShowConfirm(false)
        setGarcomToDelete(null)
        alert('Garçom excluído com sucesso!')
      })
      .catch((err) => {
        console.log(err)
        alert('Erro ao excluir garçom')
      })
  }

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
