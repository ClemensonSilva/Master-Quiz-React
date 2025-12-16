import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-32 px-4 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">Bem-vindo ao QuizRanking</h1>
          <p className="text-xl font-bold tracking-tight sm:text-3xl mb-10">Para professores e estudantes</p>
          
          <div className="space-x-4">
            <Link 
              href="/auth/cadastro" 
              className="bg-yellow-400 text-purple-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300"
            >
              Começar agora
            </Link>
            <Link 
              href="/auth/login" 
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10"
            >
              Já tenho conta
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}