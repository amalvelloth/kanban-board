import React, { useEffect, useRef } from "react";

const GRID_SIZE = 20;
const DOT_RADIUS = 1.1;
const EFFECT_RADIUS = 170;
const RETURN_EASE = 0.11;
const PUSH_STRENGTH = 20;

export default function DotGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    let animationFrameId;
    let dots = [];
    let mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      active: false,
    };

    const buildDots = (width, height) => {
      const nextDots = [];

      for (let x = GRID_SIZE / 2; x < width; x += GRID_SIZE) {
        for (let y = GRID_SIZE / 2; y < height; y += GRID_SIZE) {
          nextDots.push({
            baseX: x,
            baseY: y,
            x,
            y,
          });
        }
      }

      dots = nextDots;
    };

    const resizeCanvas = () => {
      const { innerWidth, innerHeight, devicePixelRatio = 1 } = window;

      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(devicePixelRatio, devicePixelRatio);

      buildDots(innerWidth, innerHeight);
    };

    const updateDots = () => {
      const { innerWidth, innerHeight } = window;

      context.clearRect(0, 0, innerWidth, innerHeight);
      context.fillStyle = "rgba(255, 255, 255, 0.38)";

      dots.forEach((dot) => {
        const dx = dot.baseX - mouse.x;
        const dy = dot.baseY - mouse.y;
        const distance = Math.hypot(dx, dy);

        let targetX = dot.baseX;
        let targetY = dot.baseY;

        if (mouse.active && distance < EFFECT_RADIUS) {
          const angle = Math.atan2(dy, dx);
          const force = ((EFFECT_RADIUS - distance) / EFFECT_RADIUS) * PUSH_STRENGTH;

          targetX += Math.cos(angle) * force;
          targetY += Math.sin(angle) * force;
        }

        dot.x += (targetX - dot.x) * RETURN_EASE;
        dot.y += (targetY - dot.y) * RETURN_EASE;

        context.beginPath();
        context.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        context.fill();
      });

      animationFrameId = window.requestAnimationFrame(updateDots);
    };

    const handleMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const handleLeave = () => {
      mouse.active = false;
    };

    resizeCanvas();
    updateDots();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none mix-blend-overlay absolute inset-0 z-[1]" />;
}
