import { JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "material-symbols/outlined.css";
import "./globals.css";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import "@/lib/network/initOutboundProxy"; // Auto-initialize outbound proxy env
import "@/shared/services/bootstrap"; // Auto-run initializeApp (watchdog, auto-resume tunnel)
import { initConsoleLogCapture } from "@/lib/consoleLogBuffer";
import { RuntimeI18nProvider } from "@/i18n/RuntimeI18nProvider";

// Hook console immediately at module load time (server-side only, runs once)
initConsoleLogCapture();

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "ORIONROUTER // TERMINAL AI ROUTER & TOKEN SAVER",
  description: "One endpoint for all your AI providers with OrionRouter. Manage keys, monitor usage, and scale effortlessly.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Terminal CLI: permanent phosphor monitor dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('dark');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `var d=document,r=d.documentElement,f=function(){r.classList.add('fonts-loaded')};if(d.fonts&&d.fonts.load){d.fonts.load('20px "Material Symbols Outlined"').then(f).catch(f);setTimeout(f,3000)}else{f()}`,
          }}
        />
      </head>
      <body className={`${jetbrainsMono.variable} font-mono bg-bg text-text-main antialiased selection:bg-primary selection:text-bg`}>
        <ThemeProvider>
          <RuntimeI18nProvider>
            {children}
          </RuntimeI18nProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId={"G-LC959F603F"} />
      </body>
    </html>
  );
}
