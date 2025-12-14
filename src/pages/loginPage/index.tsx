// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LoginLogo,
  LogoBaita,
  LoginBackground,
  LoginContainer,
  LoginInput,
  LoginButton
} from './style'

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // impede o refresh da página
    setError('') // limpa erro anterior

    //usuario teste admin
    //admin@admin.com / admin123
    //usuario teste garcom
    //garcom@garcom.com / garcom123

    try {
      const response = await fetch(
        'http://localhost/pic/public/index.php/users/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }
      )

      const result = await response.json()
      console.log('Console.log result', result)

      // Se o backend retornou status de erro (400, 401, 500, etc) ou não tem user
      if (!response.ok || !result.user) {
        const msg = result.message || 'Usuário ou senha incorretos'
        setError(msg)
        alert(msg) // ALERTA DE ERRO
        return
      }

      localStorage.setItem('user', JSON.stringify(result.user))

      if (result.user.admin === 'Y') {
        navigate('/adm')
      } else {
        navigate('/garcom')
      }
    } catch (err) {
      console.error(err)
      const msg = 'Erro ao conectar com o servidor'
      setError(msg)
      alert(msg) // ALERTA DE ERRO DE CONEXÃO
    }
  }

  return (
    <LoginBackground>
      <LoginContainer>
        <LoginLogo>
          <LogoBaita />
        </LoginLogo>

        <h1>Bem-vindo ao BaitaKão</h1>
        {/* importante: usar onSubmit e o botão type="submit" */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail:</label>
          <LoginInput
            id="email"
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="senha">Senha:</label>
          <LoginInput
            id="senha"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <LoginButton type="submit">Entrar</LoginButton>
          <a href="#">Forgot password?</a>

          {error && (
            <p style={{ color: 'red', marginTop: '12px', fontSize: '14px' }}>
              {error}
            </p>
          )}
        </form>
      </LoginContainer>
    </LoginBackground>
  )
}

export default Login
