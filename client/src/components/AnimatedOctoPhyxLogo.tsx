import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated OctoPhyx logo with particle effects
 */
export function AnimatedOctoPhyxLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: { container: 'w-16 h-16', circle: 'w-6 h-6', dot: 'w-1.5 h-1.5' },
    md: { container: 'w-32 h-32', circle: 'w-12 h-12', dot: 'w-2.5 h-2.5' },
    lg: { container: 'w-48 h-48', circle: 'w-16 h-16', dot: 'w-3 h-3' },
  };

  const sizes = sizeMap[size];

  // Animation variants for tentacles
  const tentacleVariants = {
    animate: (i: number) => ({
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 3 + i * 0.2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    }),
  };

  // Animation for particles
  const particleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Pulse animation for center
  const centerVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div className={`flex items-center justify-center ${sizes.container}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Define gradient for subtle effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tentacles */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i * 360) / 8;
          const startX = 100 + 40 * Math.cos((angle * Math.PI) / 180);
          const startY = 100 + 40 * Math.sin((angle * Math.PI) / 180);
          const endX = 100 + 80 * Math.cos((angle * Math.PI) / 180);
          const endY = 100 + 80 * Math.sin((angle * Math.PI) / 180);

          return (
            <motion.g
              key={`tentacle-${i}`}
              custom={i}
              variants={tentacleVariants}
              animate="animate"
              style={{ transformOrigin: '100px 100px' }}
            >
              {/* Tentacle line */}
              <path
                d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2 + 10} ${endX} ${endY}`}
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-foreground"
              />

              {/* Particles along tentacle */}
              {[0, 0.3, 0.6, 1].map((t) => {
                const x = startX + (endX - startX) * t;
                const y = startY + (endY - startY) * t + 10 * t * (1 - t);

                return (
                  <motion.circle
                    key={`particle-${i}-${t}`}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="currentColor"
                    className="text-foreground"
                    variants={particleVariants}
                    animate="animate"
                    style={{
                      transitionDelay: `${i * 0.1 + t * 0.2}s`,
                    }}
                  />
                );
              })}

              {/* End particle */}
              <motion.circle
                cx={endX}
                cy={endY}
                r="3"
                fill="currentColor"
                className="text-foreground"
                variants={particleVariants}
                animate="animate"
                style={{
                  transitionDelay: `${i * 0.1}s`,
                }}
              />
            </motion.g>
          );
        })}

        {/* Center circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="15"
          fill="currentColor"
          className="text-foreground"
          variants={centerVariants}
          animate="animate"
        />

        {/* Center glow effect */}
        <motion.circle
          cx="100"
          cy="100"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-foreground opacity-30"
          variants={{
            animate: {
              r: [15, 20, 15],
              opacity: [0.3, 0, 0.3],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            },
          }}
          animate="animate"
        />
      </svg>
    </div>
  );
}

/**
 * Animated loading screen with OctoPhyx logo and rotating facts
 */
export function OctoPhyxLoadingScreen({ message }: { message?: string }) {
  const funFacts = [
    '🌌 Light travels at 299,792,458 meters per second - the ultimate speed limit!',
    '⚛️ An electron is 2,000 times lighter than a proton.',
    '🌊 Sound travels faster in water than in air - about 1,500 m/s vs 343 m/s.',
    '🔬 The nucleus of an atom is 100,000 times smaller than the atom itself!',
    '⚡ Lightning is hotter than the surface of the sun - about 30,000 Kelvin!',
    '🪐 Jupiter\'s Great Red Spot is a storm that has raged for over 300 years.',
    '🌀 A black hole\'s gravity is so strong that not even light can escape it.',
    '🧬 Quantum entanglement allows particles to be connected across any distance.',
    '🌍 Earth\'s core is as hot as the surface of the sun - about 5,500°C!',
    '💫 A neutron star is so dense that a teaspoon of it would weigh 6 billion tons.',
    '🔋 Superconductors can conduct electricity with zero resistance below critical temperature.',
    '🌊 Waves can exhibit both particle and wave properties - wave-particle duality!',
    '⚛️ The Heisenberg Uncertainty Principle states we cannot know both position and momentum precisely.',
    '🌌 The observable universe contains about 2 trillion galaxies.',
    '🔬 Schrödinger\'s cat is both alive and dead until observed - quantum superposition!',
    '⚡ A single lightning bolt contains about 1 billion joules of energy.',
    '🪐 Saturn\'s rings are made of billions of ice particles and rocky debris.',
    '🌀 The event horizon of a black hole is the point of no return.',
    '🧪 Absolute zero is -273.15°C, the lowest possible temperature.',
    '💎 Diamond is the hardest naturally occurring material known to science.',
  ];

  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadingMessages = [
    'Generating quantum explanations...',
    'Calculating particle interactions...',
    'Visualizing physics concepts...',
    'Processing quantum states...',
    'Rendering interactive diagrams...',
    'Analyzing physics principles...',
    'Building your learning experience...',
    'Unleashing the power of OctoPhyx...',
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background space-y-8"
    >
      {/* Animated Logo */}
        <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
      >
        <AnimatedOctoPhyxLogo size="lg" />
      </motion.div>

      {/* Loading Message */}
      <motion.div
        key={currentMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-lg font-semibold text-foreground mb-4">
          {loadingMessages[currentMessage]}
        </p>
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </motion.div>

      {/* Fun Fact */}
      <motion.div
        key={currentFact}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="max-w-md text-center"
      >
        <div className="p-4 bg-card/50 border border-border rounded-lg backdrop-blur">
          <p className="text-sm text-muted-foreground italic">
            {funFacts[currentFact]}
          </p>
        </div>
      </motion.div>

      {/* Loading Indicator */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
