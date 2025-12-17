'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function LayoutProfessor({ 
  children, 
  userName = "Nome Professor",
  showHeader = true,
  showFooter = true 
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showHeader && (
        <Header
          isLoggedIn={true}
          userType="professor"
          userName={userName}
        />
      )}
      
      <main className="flex-1 bg-white">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}