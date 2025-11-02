'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

export default function Confetti({ onComplete }: { onComplete?: () => void }) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const particles: Confetti[] = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      });
    }

    setConfetti(particles);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {confetti.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ y: particle.y, x: particle.x, rotate: 0, opacity: 1 }}
            animate={{
              y: 110,
              x: particle.x + (Math.random() - 0.5) * 200,
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              opacity: 0,
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: particle.delay,
              ease: 'easeOut',
            }}
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: particle.color, left: `${particle.x}%` }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

