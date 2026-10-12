"use client";

import { useCallback, useRef, useState, type PointerEvent } from "react";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  shape: "dot" | "sparkle";
  tint: "white" | "blue";
  delay: number;
};

const STAR_COUNT = 72;
const SPARKLE =
  "polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)";

/** Deterministic PRNG so the server and client render identical stars. */
function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createStars(): Star[] {
  const random = mulberry32(20260101);

  return Array.from({ length: STAR_COUNT }, (_, id) => ({
    id,
    x: random(),
    y: random(),
    size: 1.5 + random() * 3.5,
    shape: random() > 0.78 ? "sparkle" : "dot",
    tint: random() > 0.6 ? "blue" : "white",
    delay: random() * 6,
  }));
}

// Module scope: one array shared by server render and hydration.
const INITIAL_STARS = createStars();

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function px(value: number) {
  return `${value}px`;
}

/** Dots render as a small circle; sparkles render as a 4-point star. */
function starBox(star: Star) {
  const isSparkle = star.shape === "sparkle";
  const size = px(isSparkle ? star.size * 2.6 : star.size);
  const offset = px(isSparkle ? star.size * -1.3 : star.size / -2);

  return { width: size, height: size, marginLeft: offset, marginTop: offset };
}

export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>(INITIAL_STARS);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const moveStar = useCallback((id: number, x: number, y: number) => {
    setStars((current) =>
      current.map((star) => (star.id === id ? { ...star, x, y } : star))
    );
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (draggingId === null) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    moveStar(
      draggingId,
      clamp((event.clientX - rect.left) / rect.width),
      clamp((event.clientY - rect.top) / rect.height)
    );
  }

  function handleDragStart(event: PointerEvent<HTMLDivElement>, id: number) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingId(id);
  }

  function handleDragEnd(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDraggingId(null);
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          onPointerDown={(event) => handleDragStart(event, star.id)}
          className={`pointer-events-auto absolute touch-none select-none ${
            draggingId === star.id ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            left: `${star.x * 100}%`,
            top: `${star.y * 100}%`,
            ...starBox(star),
            clipPath: star.shape === "sparkle" ? SPARKLE : undefined,
            background:
              star.tint === "blue"
                ? "linear-gradient(180deg, #BFDBFE, #60A5FA)"
                : "linear-gradient(180deg, #FFFFFF, #DBEAFE)",
            boxShadow:
              star.tint === "blue"
                ? "0 0 6px 1px rgba(96,165,250,0.85)"
                : "0 0 5px 0.5px rgba(255,255,255,0.75)",
            animation: `twinkle 4s ease-in-out ${star.delay}s infinite`,
            transition: draggingId === star.id ? "none" : "left 120ms ease-out, top 120ms ease-out",
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="twinkle"] { animation: none; opacity: 0.75; }
        }
      `}</style>
    </div>
  );
}