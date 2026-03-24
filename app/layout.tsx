import type { Metadata } from "next";
import {
  Playfair_Display,
  Space_Mono,
  Abril_Fatface,
  Pacifico,
  Dancing_Script,
  Bebas_Neue,
  Press_Start_2P,
  Cinzel,
  Permanent_Marker,
  Rubik_Dirt,
  Boogaloo,
  Lobster,
  Righteous,
  Special_Elite,
  Monoton,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "700", "900"] });
const spaceMono = Space_Mono({ subsets: ["latin"], variable: "--font-space-mono", weight: ["400", "700"] });
const abril = Abril_Fatface({ subsets: ["latin"], variable: "--font-abril", weight: "400" });
const pacifico = Pacifico({ subsets: ["latin"], variable: "--font-pacifico", weight: "400" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing", weight: ["400", "700"] });
const bebas = Bebas_Neue({ subsets: ["latin"], variable: "--font-bebas", weight: "400" });
const pressStart = Press_Start_2P({ subsets: ["latin"], variable: "--font-press-start", weight: "400" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", weight: ["400", "700", "900"] });
const permanentMarker = Permanent_Marker({ subsets: ["latin"], variable: "--font-permanent-marker", weight: "400" });
const rubikDirt = Rubik_Dirt({ subsets: ["latin"], variable: "--font-rubik-dirt", weight: "400" });
const boogaloo = Boogaloo({ subsets: ["latin"], variable: "--font-boogaloo", weight: "400" });
const lobster = Lobster({ subsets: ["latin"], variable: "--font-lobster", weight: "400" });
const righteous = Righteous({ subsets: ["latin"], variable: "--font-righteous", weight: "400" });
const specialElite = Special_Elite({ subsets: ["latin"], variable: "--font-special-elite", weight: "400" });
const monoton = Monoton({ subsets: ["latin"], variable: "--font-monoton", weight: "400" });

export const metadata: Metadata = {
  title: "❤️ anshula — curiosity never dies because of people like you",
  description: "curiosity never dies because of people like you",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    playfair.variable,
    spaceMono.variable,
    abril.variable,
    pacifico.variable,
    dancing.variable,
    bebas.variable,
    pressStart.variable,
    cinzel.variable,
    permanentMarker.variable,
    rubikDirt.variable,
    boogaloo.variable,
    lobster.variable,
    righteous.variable,
    specialElite.variable,
    monoton.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
