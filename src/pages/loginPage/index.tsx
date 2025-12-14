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

  // Caminho relativo para o backend PHP
  // Em produção: https://seu-dominio.com.br/pic/login.php
  // Em dev (se React e PHP estiverem no mesmo domínio): http://localhost/pic/login.php
  const API_LOGIN_URL = 'http://localhost/pic/login.php'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // impede o refresh da página
    setError('') // limpa erro anterior

    // usuario teste admin
    // admin@admin.com / admin123
    // usuario teste garcom
    // garcom@garcom.com / garcom123

    try {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const result = await response.json()
      console.log('Console.log result', result)

      // Se o backend retornou status de erro (400, 401, 500, etc) ou não tem user
      if (!response.ok || !result.user) {
        const msg = result.message || 'Usuário ou senha incorretos'
        setError(msg)
        alert(msg) // ALERTA DE ERRO
        return
      }

      // user esperado do backend:
      // { id: number, email: string, role: 'A' | 'G' | 'U' }
      localStorage.setItem('user', JSON.stringify(result.user))

      const role = result.user.role

      if (role === 'A') {
        // Admin
        navigate('/adm')
      } else if (role === 'G') {
        // Garçom
        navigate('/garcom')
      } else {
        // Usuário comum (U) ou qualquer outro fallback
        navigate('/usuario')
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
