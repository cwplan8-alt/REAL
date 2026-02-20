import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Idea B - Style Search",
  description: "Architectural-style home search MVP",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <a className="font-semibold" href="/">Style Search MVP</a>
            <nav className="flex gap-4 text-sm">
              <a href="/search">Search</a>
              <a href="/pricing">Pricing</a>
              <a href="/admin">Admin</a>
              <a href="/auth">Auth</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
