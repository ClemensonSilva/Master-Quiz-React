import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';


const Header = ({ isLoggedIn = false, userType, userName }) => {
  return (
    <header className="bg-black text-white">
      <div className="container mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold px-2 py-1 cursor-pointer">QuizRanking</h1>
        </Link>
        
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
             <span className="hidden md:inline text-sm font-medium">{userName}</span>
             <Link href="/logout">
                <Button variant="outline" size="sm">Sair</Button>
             </Link>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link href="/auth/cadastro">
                <Button variant="primary" className='border border-gray-600' size="sm">Cadastrar-se</Button>
            </Link>
            <Link href="/auth/login">
                <Button variant="outline" size="sm">Login</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;