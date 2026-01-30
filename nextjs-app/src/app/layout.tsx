import type { Metadata } from "next";

// Se tiveres um ficheiro global de CSS, importa-o aqui. 
// Se não tiveres, comenta esta linha para não dar erro.
import "../styles/globals.css"; // ".." sobe uma pasta e entra em styles

export const metadata: Metadata = {
  title: "Interview Lab",
  description: "My Frontend Interview Preparation Space",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  );
}