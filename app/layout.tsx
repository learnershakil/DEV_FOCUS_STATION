import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AppSidebar } from '@/components/app-sidebar';
import { MobileNav } from '@/components/mobile-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Student Flow OS',
  description: 'Productivity for the modern student.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1 md:pl-64 pb-24 md:pb-0">
              {children}
            </main>
            <MobileNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
