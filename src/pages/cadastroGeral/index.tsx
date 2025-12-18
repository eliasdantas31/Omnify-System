import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Form } from './style'

const CadastroGeral = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Ideal: depois trocar para variável de ambiente
  const API_CADASTRO_ADMIN_URL = 'http://localhost/pic/cadastroAdmin.php'

  // Opcional: proteger rota para só Manager (role 'M')
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      navigate('/login')
      return
    }

    const user = JSON.parse(stored)
    if (user.role !== 'M') {
      alert('Acesso permitido apenas para o Manager.')
      navigate('/')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password || !confirmPassword) {
      setError('Preencha todos os campos.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    try {
      const response = await fetch(API_CADASTRO_ADMIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // se quiser usar sessão por cookie:
        // credentials: 'include',
        body: JSON.stringify({ email, password, confirmPassword })
      })

      const result = await response.json()
      console.log('Cadastro admin result:', result)

      if (!response.ok || !result.success) {
        const msg = result.message || 'Erro ao cadastrar administrador.'
        setError(msg)
        alert(msg)
        return
      }

      setSuccess('Administrador cadastrado com sucesso!')
      alert('Administrador cadastrado com sucesso!')

      // Limpa campos
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error(err)
      const msg = 'Erro ao conectar com o servidor.'
      setError(msg)
      alert(msg)
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1>Cadastrar Administrador</h1>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Email do administrador"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Confirmar Senha:</label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirme a senha"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Cadastrar</button>
        </div>

        {error && (
          <p style={{ color: 'red', marginTop: '12px', fontSize: '14px' }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: 'green', marginTop: '12px', fontSize: '14px' }}>
            {success}
          </p>
        )}
      </Form>
    </Container>
  )
}

export default CadastroGeral
