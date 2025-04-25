// app/layout.js
export const metadata = {
  title: 'BookEase',
  description: 'Real-time movie ticket booking app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
