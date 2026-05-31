import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Aslé Joyería",
  description: "Elegancia que perdura. Diseños hechos para resaltar tu esencia.",
  openGraph: {
    title: "Aslé Joyería",
    description: "Elegancia que perdura. Diseños hechos para resaltar tu esencia.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${cormorant.variable} ${raleway.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

