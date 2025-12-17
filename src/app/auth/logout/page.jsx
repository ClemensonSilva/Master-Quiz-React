'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        // 1. Limpa os dados de autenticação
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('disciplinaId'); // Limpa dados residuais de navegação

        // Ou, para garantir que limpa tudo:
        // localStorage.clear(); 

        // 2. Redireciona para a tela de login
        router.push('/auth/login');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 animate-pulse">Encerrando sessão...</p>
        </div>
    );
}