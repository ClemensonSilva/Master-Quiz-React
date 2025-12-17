'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { apiFetch } from '@/services/api';

export default function CadastroPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        tipoUsuario: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const userOptions = [
        { value: 'estudante', label: 'Estudante' },
        { value: 'professor', label: 'Professor' }
    ];


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.senha !== formData.confirmarSenha) {
            alert("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }

        try {
            let url
            if(formData.tipoUsuario == 'professor' ) {
                console.log("Endpoint para professor");
                url = '/usuarios/professores';
            }
            if(formData.tipoUsuario == 'estudante') {
                console.log("Endpoint para estudante");
                url = '/usuarios/alunos';
                console.log("Form Data:", formData);
                console.log("Enviando para URL:", url);
            }
            const response = await apiFetch(url, {
                    method: 'POST',
                    body: JSON.stringify({ email: formData.email, senha: formData.senha, nome: formData.nome }),
                  });
            
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }

            console.log("Enviando dados:", formData);
            //Ainda irei conectar com a API aqui

            alert('Cadastro realizado com sucesso!');
            router.push('/auth/login'); 
            
        } catch (error) {
            alert('Erro ao cadastrar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-grow items-start justify-center text-gray-900">
                <div className="w-[500px] mx-auto mt-20 mb-20 p-8 bg-white rounded-xl shadow-xl">
                    <h2 className="text-center mb-6 text-2xl font-semibold text-gray-900">Cadastro</h2>

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <Select
                            label="Tipo de Usuário"
                            name="tipoUsuario"      
                            options={userOptions}   
                            value={formData.tipoUsuario} 
                            onChange={handleChange} 
                            required
                        />

                        <Input 
                            label="Nome Completo"
                            type="text"
                            name="nome" 
                            id="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />

                        <Input 
                            label="Endereço de e-mail"
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <Input 
                            label="Senha"
                            type="password"
                            name="senha"
                            id="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            maxLength="25"
                            minLength="6" 
                            required
                        />

                        <Input 
                            label="Confirmar Senha"
                            type="password"
                            name="confirmarSenha"
                            id="confirmarSenha"
                            value={formData.confirmarSenha}
                            onChange={handleChange}
                            maxLength="25"
                            minLength="6" 
                            required
                        />

                        <Button 
                            variant="primary" 
                            fullWidth 
                            type="submit"
                            className="mt-6"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cadastrando...' : 'Inscrever-se'}
                        </Button>
                    </form>
                    
                    <Link href="/auth/login" className="block text-center mt-4 text-sm text-gray-900 hover:underline">
                        Já tem uma conta? Faça login
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}