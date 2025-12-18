import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SearchBar from '@/components/display/searchBar';
import Button from '@/components/ui/button';

export default function DashboardTemplate({ 
    user,              
    loadingUser,       // Boolean carregamento inicial
    title,             
    actionButton,      
    searchTerm,        
    setSearchTerm,     
    isSearching,       
    children           
}) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header isLoggedIn={true} userName={user.nome || 'Usuário'} userType={user.type || 'aluno'} />

            <main className="container mx-auto max-w-7xl px-6 py-8 flex-grow">
                <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
                    <div className="mb-4 md:mb-0">
                        {loadingUser ? (
                            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                            <h2 className="text-3xl font-light text-gray-800">
                                Olá, <span className="font-semibold">{user.nome}</span>
                            </h2>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.nome || 'User'}&background=random`}
                                alt="Avatar"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        {actionButton}
                    </div>
                </section>

                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
                        <SearchBar 
                            searchTerm={searchTerm} 
                            setSearchTerm={setSearchTerm} 
                            isSearching={isSearching} 
                        />
                    </div>
                    
                    {children}
                </section>

            </main>
            <Footer />
        </div>
    );
}