import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talkwarts — AI English Speaking Academy",
  description:
    "Zamonaviy AI so‘zlashuv platformasi. Ingliz tilida erkin, ravon va ishonch bilan so‘zlashing.",
  openGraph: {
    title: "Talkwarts — AI English Speaking Academy",
    description: "Ingliz tili nutqingizni AI yordamida yangi bosqichga olib chiqing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="scroll-smooth bg-white">
      <body className="antialiased bg-white text-slate-900 min-h-screen selection:bg-[#FACC15] selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
