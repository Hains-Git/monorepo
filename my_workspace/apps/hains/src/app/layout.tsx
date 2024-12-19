import './global.css';

export const metadata = {
  title: 'Next.js Monorepo',
  description: 'Monorepo für die neue Next.js Applikation'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
