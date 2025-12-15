import { Inter } from "next/font/google";
import "./globals.css";

// Configura a fonte Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Define a variável CSS que o Tailwind vai usar
  display: "swap",
});

export const metadata = {
  title: "QuizRanking",
  description: "Sistema de Ranking de Quizzes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}