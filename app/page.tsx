"use client";

import { useEffect, useRef, useState } from "react";

const FONTS = [
  "--font-playfair",
  "--font-space-mono",
  "--font-abril",
  "--font-pacifico",
  "--font-dancing",
  "--font-bebas",
  "--font-press-start",
  "--font-cinzel",
  "--font-permanent-marker",
  "--font-rubik-dirt",
  "--font-boogaloo",
  "--font-lobster",
  "--font-righteous",
  "--font-special-elite",
  "--font-monoton",
];

// Palette: warm gold / rose / white / soft lavender on black
const COLORS = [
  "rgba(255,255,255,",
  "rgba(255,214,128,",
  "rgba(255,182,193,",
  "rgba(200,200,255,",
  "rgba(255,255,200,",
  "rgba(180,255,220,",
  "rgba(255,200,160,",
];

interface Token {
  text: string;
  fontVar: string;
  fontSize: number;
  color: string;
  opacity: number;
  x: number;
  y: number;
  rotation: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function buildTokens(width: number, height: number): Token[] {
  const tokens: Token[] = [];
  const rand = seededRandom(42);

  const colWidth = 260;
  const rowHeight = 90;

  const cols = Math.ceil(width / colWidth) + 2;
  const rows = Math.ceil(height / rowHeight) + 2;

  let fontIndex = 0;
  let colorIndex = 0;

  for (let row = 0; row < rows; row++) {
    const stagger = (row % 2) * (colWidth / 2);
    for (let col = 0; col < cols; col++) {
      const fontVar = FONTS[fontIndex % FONTS.length];
      const colorBase = COLORS[colorIndex % COLORS.length];

      const sizeClass = rand();
      let fontSize: number;
      if (sizeClass < 0.15) fontSize = 14 + rand() * 8;
      else if (sizeClass < 0.45) fontSize = 24 + rand() * 16;
      else if (sizeClass < 0.75) fontSize = 44 + rand() * 20;
      else fontSize = 68 + rand() * 40;

      const rotation = (rand() - 0.5) * 18;
      const opacity = 0.12 + rand() * 0.75;

      const x = col * colWidth + stagger - colWidth * 0.3 + rand() * 40 - 20;
      const y = row * rowHeight - rowHeight * 0.5 + rand() * 30 - 15;

      tokens.push({
        text: "anshula",
        fontVar,
        fontSize,
        color: colorBase,
        opacity,
        x,
        y,
        rotation,
      });

      fontIndex++;
      colorIndex += 3;
    }
  }

  return tokens;
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function compute() {
      setTokens(buildTokens(window.innerWidth, window.innerHeight));
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "#000",
      }}
    >
      {tokens.map((t, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            fontFamily: `var(${t.fontVar})`,
            fontSize: t.fontSize,
            color: `${t.color}${t.opacity})`,
            transform: `rotate(${t.rotation}deg)`,
            transformOrigin: "center center",
            whiteSpace: "nowrap",
            userSelect: "none",
            lineHeight: 1,
            pointerEvents: "none",
            letterSpacing: t.fontSize > 50 ? "0.05em" : "normal",
          }}
        >
          {t.text}
        </span>
      ))}
    </div>
  );
}
