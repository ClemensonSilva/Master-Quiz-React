import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email.trim() === '' || senha.trim() === '') {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Simulação de Login (baseado em login.js)
    alert('Login realizado com sucesso!');
    
    // Redireciona para o dashboard do aluno (baseado em login.js)
    router.push('/aluno/dashboard-aluno'); 
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      <Header />
      <main className="flex flex-grow items-start justify-center text-gray-900">
        
        {/* Caixa de Login: simula .caixa-login */}
        <div className="w-[500px] mx-auto mt-20 p-8 bg-white rounded-xl shadow-xl">
          <h2 className="text-center mb-6 text-2xl font-semibold text-gray-900">Login</h2>
          
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
              minLength="6"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <Button 
              variant="primary" 
              fullWidth 
              type="submit"
              className="mt-2"
            >
              Entrar
            </Button>
          </form>
          
          <Link href="/cadastro" className="block text-center mt-4 text-sm text-gray-900 hover:underline">
            Não tem uma conta? Inscreva-se
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}