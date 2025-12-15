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


    setIsLoading(true);

    try {
      const response = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        let token = response.headers.get('Authorization') || response.headers.get('Bearer');
        
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7);
        }

        // 2. TENTA LER O CORPO (Caso o token não esteja no header)
        let data = {};
        try {
            const textData = await response.text();
            if (textData) {
                data = JSON.parse(textData);
            }
        } catch (e) {
            console.log("Resposta sem corpo JSON, usando apenas headers.");
        }

        if (!token && data.token) {
            token = data.token;
        }

        if (token) {
          if (token) {
            localStorage.setItem('authToken', token);
            
            const decoded = parseJwt(token);
            
            const userEmail = decoded?.sub ;  // acessa o email do usuário
            
            if (userEmail) {
                localStorage.setItem('userEmail', userEmail); 
            }

            const userType = data.userType || 'aluno'; 
            localStorage.setItem('userType', userType);
            setAlert({ type: "success", message: "Login realizado com sucesso!" });
            

            if (userType === 'professor') {
                router.push('/dashboard/professor');
            } else {
                router.push('/dashboard/aluno');
            }

            
        } else {
            throw new Error("Token não encontrado na resposta do servidor.");
        }

      } else {
        let msg = 'Credenciais inválidas.';
        try {
            const errorData = await response.json();
            if(errorData.message) msg = errorData.message;
        } catch(e) {  }
        
        setAlert({ type: "error", message: msg });
      }
    }
    } catch (networkError) {
      console.error(networkError);
      setAlert({ type: "error", message: "Erro ao processar login. Verifique o console." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>

      <main className="flex flex-grow items-start justify-center text-gray-900">
        <div className="w-[500px] mx-auto mt-20 p-8 bg-white rounded-xl shadow-xl">
          <h2 className="text-center mb-6 text-2xl font-semibold text-gray-900">Login</h2>
          
          {alert && (
            <div className="mb-4">
                <Alert type={alert.type} message={alert.message} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input 
              label="Endereço de e-mail"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input 
              label="Senha"
              type="password"
              id="senha"
              maxLength="25"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
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
          
          <Link href="/auth/cadastro" className="block text-center mt-4 text-sm text-gray-900 hover:underline">
            Não tem uma conta? Inscreva-se 
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
