import type { Metadata } from 'next';
import Header from '../components/Header';
import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'Cinema - Filmes que Prestam',
  description: 'Descubra filmes desconhecidos e críticas de qualidade para o público brasileiro.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}