"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

// Red palette: scarlet, crimson, rose, burgundy, coral, hot-pink-red, white-red
const COLORS = [
  "rgba(255,30,30,",
  "rgba(220,20,60,",
  "rgba(255,80,80,",
  "rgba(180,0,30,",
  "rgba(255,120,100,",
  "rgba(255,255,255,",
  "rgba(255,60,100,",
  "rgba(140,0,20,",
  "rgba(255,160,160,",
];

interface Token {
  text: string;
  fontVar: string;
  fontSize: number;
  colorBase: string;
  opacity: number;
  baseX: number;
  baseY: number;
  rotation: number;
}

// Mutable physics state per token (not in React state — avoids re-renders)
interface TokenPhysics {
  dx: number;
  dy: number;
  vx: number;
  vy: number;
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

      const baseX = col * colWidth + stagger - colWidth * 0.3 + rand() * 40 - 20;
      const baseY = row * rowHeight - rowHeight * 0.5 + rand() * 30 - 15;

      tokens.push({ text: "anshula", fontVar, fontSize, colorBase, opacity, baseX, baseY, rotation });

      fontIndex++;
      colorIndex += 3;
    }
  }

  return tokens;
}

// Spring constants
const SPRING = 0.06;    // pull back to origin
const DAMPING = 0.82;   // velocity decay
const REPEL_RADIUS = 180;
const REPEL_FORCE = 4500;

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const physicsRef = useRef<TokenPhysics[]>([]);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);

  // Build tokens on mount and resize
  const compute = useCallback(() => {
    const t = buildTokens(window.innerWidth, window.innerHeight);
    setTokens(t);
    physicsRef.current = t.map(() => ({ dx: 0, dy: 0, vx: 0, vy: 0 }));
    spanRefs.current = new Array(t.length).fill(null);
  }, []);

  useEffect(() => {
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [compute]);

  // Mouse / touch pointer tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onLeave = () => { pointerRef.current = null; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // DeviceOrientation (gyroscope) — maps tilt to a virtual pointer
  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      // gamma = left/right tilt [-90, 90], beta = front/back [-180, 180]
      if (e.gamma == null || e.beta == null) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      pointerRef.current = {
        x: w / 2 + (e.gamma / 45) * w * 0.6,
        y: h / 2 + ((e.beta - 30) / 45) * h * 0.6,
      };
    };
    window.addEventListener("deviceorientation", onOrient, true);
    return () => window.removeEventListener("deviceorientation", onOrient, true);
  }, []);

  // Animation loop — runs outside React state
  useEffect(() => {
    if (tokens.length === 0) return;

    const loop = () => {
      const physics = physicsRef.current;
      const pointer = pointerRef.current;

      for (let i = 0; i < physics.length; i++) {
        const token = tokens[i];
        const p = physics[i];
        const el = spanRefs.current[i];
        if (!el) continue;

        // Repulsion from pointer
        if (pointer) {
          const cx = token.baseX + p.dx;
          const cy = token.baseY + p.dy;
          const ddx = cx - pointer.x;
          const ddy = cy - pointer.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);

          if (dist < REPEL_RADIUS && dist > 0.1) {
            const force = REPEL_FORCE / (dist * dist);
            p.vx += (ddx / dist) * force;
            p.vy += (ddy / dist) * force;
          }
        }

        // Spring back to origin
        p.vx += -p.dx * SPRING;
        p.vy += -p.dy * SPRING;

        // Damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // Integrate
        p.dx += p.vx;
        p.dy += p.vy;

        // Apply transform directly to DOM (no React state re-render)
        el.style.transform = `translate(${p.dx}px, ${p.dy}px) rotate(${token.rotation}deg)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tokens]);

  return (
    <div
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
          ref={(el) => { spanRefs.current[i] = el; }}
          style={{
            position: "absolute",
            left: t.baseX,
            top: t.baseY,
            fontFamily: `var(${t.fontVar})`,
            fontSize: t.fontSize,
            color: `${t.colorBase}${t.opacity})`,
            transform: `rotate(${t.rotation}deg)`,
            transformOrigin: "center center",
            whiteSpace: "nowrap",
            userSelect: "none",
            lineHeight: 1,
            pointerEvents: "none",
            letterSpacing: t.fontSize > 50 ? "0.05em" : "normal",
            willChange: "transform",
          }}
        >
          {t.text}
        </span>
      ))}
    </div>
  );
}
