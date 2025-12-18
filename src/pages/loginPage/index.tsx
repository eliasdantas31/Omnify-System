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

  // Ideal: depois trocar para variável de ambiente (VITE_API_URL, por ex.)
  const API_LOGIN_URL = 'http://localhost/pic/login.php'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // se você quiser que a sessão PHP funcione por cookie:
        // credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const result = await response.json()
      console.log('Console.log result', result)

      if (!response.ok || !result.user) {
        const msg = result.message || 'Usuário ou senha incorretos'
        setError(msg)
        alert(msg)
        return
      }

      // user esperado do backend:
      // { id: number, email: string, role: 'A' | 'G' | 'U' | 'M' }
      localStorage.setItem('user', JSON.stringify(result.user))

      const role = result.user.role as 'A' | 'G' | 'U' | 'M' | string

      // Se o backend enviou redirectTo, respeita:
      if (result.redirectTo) {
        navigate(result.redirectTo)
        return
      }

      // Fallback se por algum motivo não vier redirectTo:
      if (role === 'A') {
        navigate('/adm')
      } else if (role === 'G') {
        navigate('/garcom')
      } else if (role === 'M') {
        navigate('/cadastroGeral') // Manager -> página de cadastro geral
      } else {
        navigate('/usuario')
      }
    } catch (err) {
      console.error(err)
      const msg = 'Erro ao conectar com o servidor'
      setError(msg)
      alert(msg)
    }
  }

  return (
    <LoginBackground>
      <LoginContainer>
        <LoginLogo>
          <LogoBaita />
        </LoginLogo>

        <h1>Bem-vindo ao BaitaKão</h1>
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
