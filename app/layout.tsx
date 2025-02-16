import { ThemeProvider } from "./providers/theme-provider";
import "./globals.css";
import Head from "next/head";
export const metadata = {
  manifest: "/manifest.json",
  name: "HMS",
  short_name: "HMS",
  description: "Hostel APP",
  start_url: "/",
  display: "standalone",
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
