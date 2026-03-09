import { ThemeProvider } from "./providers/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import "./globals.css";
import Head from "next/head";
export const metadata = {
  manifest: "/manifest.json",
  name: "NIVAS",
  short_name: "NIVAS",
  description: "NIVAS",
  start_url: "/",
  display: "standalone",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" }
    ]
  }
};

export function generateViewport() {
  return {
    themeColor: "#111827",
  };
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
      </Head>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
