import type { Metadata, Viewport } from "next";
import "./globals.css";
import { APP_METADATA } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${APP_METADATA.name} — Student Savings & Budgeting`,
    template: `%s | ${APP_METADATA.name}`,
  },
  description: `${APP_METADATA.description} Owned and crafted by ${APP_METADATA.owner}.`,
  authors: [{ name: APP_METADATA.owner }],
  creator: APP_METADATA.owner,
  keywords: [
    "SaveWise LK",
    "Sri Lanka student finance",
    "budgeting app Sri Lanka",
    "student savings tracker",
    "LKR finance",
    "Thasika Ragupathy",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#176B4D" },
    { media: "(prefers-color-scheme: dark)", color: "#0C1411" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('savewise-lk:v1');
                if (stored) {
                  const parsed = JSON.parse(stored);
                  const theme = parsed?.state?.theme;
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-surface-light dark:bg-surface-dark text-charcoal dark:text-charcoal-dark selection:bg-brand-500/20 selection:text-brand-700">
        {children}
      </body>
    </html>
  );
}
