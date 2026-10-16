import React from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="max-w-md mx-auto min-h-screen relative">
          {children}
        </main>
      </body>
    </html>
  );
}
