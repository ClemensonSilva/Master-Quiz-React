'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alertas';

import { apiFetch } from '@/services/api';
import { parseJwt } from '@/utils/auth';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlert(null);

    // 🔒 Validação frontend
    if (!email || !senha) {
      setAlert({
        type: 'error',
        message: 'Informe e-mail e senha.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      });

      // ✅ LOGIN OK
      if (response.ok) {
        let token =
          response.headers.get('Authorization') ||
          response.headers.get('Bearer');

        if (token?.startsWith('Bearer ')) {
          token = token.slice(7);
        }

        // tenta pegar token do corpo
        let data = {};
        try {
          const text = await response.text();
          if (text) data = JSON.parse(text);
        } catch (_) {}

        if (!token && data?.token) {
          token = data.token;
        }

        if (!token) {
          throw new Error('Token não encontrado.');
        }

        // 💾 Salva token
        localStorage.setItem('authToken', token);

        const decoded = parseJwt(token);

        if (decoded?.sub) {
          localStorage.setItem('userEmail', decoded.sub);
        }

        const userType = data?.userType || decoded?.role || 'aluno';
        localStorage.setItem('userRole', decoded?.role);
        localStorage.setItem('userType', userType);

        setAlert({
          type: 'success',
          message: 'Login realizado com sucesso!'
        });

        // 🚀 Redirecionamento
        if (userType === 'ROLE_PROFESSOR') {
          router.push('/professor/dashboard');
        } else {
          router.push('/aluno/dashboard');
        }
      }

      // ❌ CREDENCIAIS INVÁLIDAS
      else if (response.status === 401 || response.status === 403) {
        setAlert({
          type: 'error',
          message: 'E-mail ou senha inválidos.'
        });
        setSenha('');
      }

      // ❌ OUTROS ERROS
      else {
        let msg = 'Erro ao realizar login.';
        try {
          const errorData = await response.json();
          if (errorData?.message) msg = errorData.message;
        } catch (_) {}

        setAlert({ type: 'error', message: msg });
        setSenha('');
      }
    } catch (error) {
      console.error(error);
      setAlert({
        type: 'error',
        message: 'Erro ao conectar com o servidor.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-grow items-start justify-center text-gray-900">
        <div className="w-[500px] mx-auto mt-20 p-8 bg-white rounded-xl shadow-xl">
          <h2 className="text-center mb-6 text-2xl font-semibold">
            Login
          </h2>

          {alert && (
            <div className="mb-4">
              <Alert type={alert.type} message={alert.message} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Endereço de e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              maxLength={25}
              required
            />

            <Button
              variant="primary"
              fullWidth
              type="submit"
              className="mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <Link
            href="/auth/cadastro"
            className="block text-center mt-4 text-sm hover:underline"
          >
            Não tem uma conta? Inscreva-se
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
