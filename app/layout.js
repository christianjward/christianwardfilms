import "./globals.css";

export const metadata = {
  title: "Christian Ward Films | Strategy Meets Cinematic Production",
  description: "Full-Stack Content Creation. Visuals. Audio. Innovation.",
  openGraph: {
    title: "Christian Ward Films | Strategy Meets Cinematic Production",
    description: "Full-Stack Content Creation. Visuals. Audio. Innovation.",
    url: "https://christianward.net",
    siteName: "Christian Ward Films",
    images: [
      {
        url: "/profile.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Ward Films",
    description: "Full-Stack Content Creation. Visuals. Audio. Innovation.",
    images: ["/profile.png"],
  },
};

import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4CVMWZFYJL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4CVMWZFYJL');
          `}
        </Script>
      </body>
    </html>
  );
}
