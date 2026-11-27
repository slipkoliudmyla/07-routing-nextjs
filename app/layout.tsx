import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import 'modern-normalize/modern-normalize.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Search, organize, and manage your notes.',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          <div className="siteContent">{children}</div>
          <Footer />
          {modal}
        </TanStackProvider>
      </body>
    </html>
  );
}
