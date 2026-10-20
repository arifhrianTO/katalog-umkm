import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PendaftarSW from "@/components/PendaftarSW";
import { toko } from "@/lib/toko";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: toko.nama,
    template: `%s | ${toko.nama}`,
  },
  description: toko.tagline,
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: toko.nama,
    description: toko.tagline,
    siteName: toko.nama,
    locale: "id_ID",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#1f6b4f",
};

const skripInisialisasiTema = `
  (function() {
    try {
      const t = localStorage.getItem('katalog_tema');
      if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (_) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: skripInisialisasiTema }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <PendaftarSW />
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}