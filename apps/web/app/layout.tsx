import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './lib/auth-context';

export const metadata: Metadata = {
  title: 'CHIAC-ASI | Onboarding Platform',
  description: 'AI-powered onboarding and learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;600;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased text-slate-900 min-h-screen relative mesh-bg">
        <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.06] mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
        <div className="relative z-10 font-body">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
