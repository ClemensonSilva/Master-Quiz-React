/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'quiz-purple': '#7F56D9',
        'quiz-dark': '#101828',
        'quiz-light-gray': '#F9FAFB',
        'quiz-text': '#344054',
        'quiz-progress': '#374151',
      },
      fontFamily: {
        // Mapeia a classe 'font-sans' para a variável CSS que configuraremos no layout
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};