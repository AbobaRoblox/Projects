import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fusion RP | Roblox Roleplay Project',
  description: 'A premium cinematic roleplay experience built for Roblox.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
