import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PomodoroTimer from '@/components/PomodoroTimer';

const Index = () => {
  const [progress, setProgress] = useState(0);

  const handleProgressChange = useCallback((newProgress: number) => {
    setProgress(newProgress);
  }, []);

  // Aura height grows from bottom to fully cover screen as timer progresses
  const auraHeight = 40 + progress * 60; // Start at 40%, grow to 100%
  
  // Layer colors that appear at different progress stages
  const getLayerOpacity = (startProgress: number, endProgress: number) => {
    if (progress < startProgress) return 0;
    if (progress > endProgress) return 1;
    return (progress - startProgress) / (endProgress - startProgress);
  };

  const layers = [
    {
      // Deep purple/indigo base
      inner: 'hsla(280, 40%, 35%, 0.8)',
      middle: 'hsla(250, 35%, 18%, 0.6)',
      outer: 'hsla(234, 32%, 12%, 0)',
      opacity: getLayerOpacity(0, 0.15),
      blur: 40
    },
    {
      // Magenta layer
      inner: 'hsla(340, 55%, 55%, 0.7)',
      middle: 'hsla(340, 55%, 45%, 0.4)',
      outer: 'hsla(280, 40%, 35%, 0)',
      opacity: getLayerOpacity(0.12, 0.3),
      blur: 50
    },
    {
      // Orange-red layer
      inner: 'hsla(15, 70%, 55%, 0.75)',
      middle: 'hsla(15, 70%, 45%, 0.4)',
      outer: 'hsla(340, 55%, 45%, 0)',
      opacity: getLayerOpacity(0.25, 0.45),
      blur: 45
    },
    {
      // Golden orange layer
      inner: 'hsla(30, 85%, 55%, 0.8)',
      middle: 'hsla(30, 80%, 50%, 0.45)',
      outer: 'hsla(15, 70%, 45%, 0)',
      opacity: getLayerOpacity(0.4, 0.6),
      blur: 40
    },
    {
      // Bright yellow layer
      inner: 'hsla(42, 90%, 60%, 0.85)',
      middle: 'hsla(42, 85%, 55%, 0.5)',
      outer: 'hsla(30, 80%, 50%, 0)',
      opacity: getLayerOpacity(0.55, 0.75),
      blur: 35
    },
    {
      // Sky blue final layer
      inner: 'hsla(200, 70%, 75%, 0.7)',
      middle: 'hsla(200, 65%, 65%, 0.4)',
      outer: 'hsla(42, 85%, 55%, 0)',
      opacity: getLayerOpacity(0.7, 0.95),
      blur: 30
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[hsl(234,32%,12%)]">
      {/* Layered sunrise aura - each color layer fades in additively */}
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          className="fixed inset-x-0 bottom-0 pointer-events-none"
          initial={{ height: "40%", opacity: 0 }}
          animate={{ 
            height: `${auraHeight}%`,
            opacity: layer.opacity
          }}
          transition={{
            height: { type: "spring", stiffness: 20, damping: 30, mass: 1 },
            opacity: { duration: 1.5, ease: "easeInOut" }
          }}
          style={{
            background: `
              radial-gradient(
                ellipse 120% 100% at 50% 100%,
                ${layer.inner} 0%,
                ${layer.middle} 50%,
                ${layer.outer} 100%
              )
            `,
            filter: `blur(${layer.blur}px)`,
            mixBlendMode: 'screen'
          }}
        />
      ))}

      {/* Secondary ambient glow */}
      <motion.div 
        className="fixed inset-x-0 bottom-0 pointer-events-none"
        animate={{
          height: `${Math.min(100, auraHeight * 1.2)}%`,
          opacity: 0.6
        }}
        transition={{
          height: { type: "spring", stiffness: 15, damping: 35 },
          opacity: { duration: 2, ease: "easeInOut" }
        }}
        style={{
          background: `
            radial-gradient(
              ellipse 150% 60% at 50% 100%,
              hsla(${progress < 0.5 ? '280, 40%, 35%' : progress < 0.85 ? '30, 85%, 55%' : '42, 90%, 60%'}, 0.3) 0%,
              transparent 60%
            )
          `,
          mixBlendMode: 'screen'
        }}
      />


      {/* Main content */}
      <main className="relative z-10 w-full max-w-lg mx-auto">
        <div>
          <PomodoroTimer onProgressChange={handleProgressChange} />
        </div>
      </main>

      {/* Subtle hint text */}
      <p className="mt-8 text-sm text-foreground/40 text-center max-w-xs relative z-10">
        Watch the sunrise as you focus
      </p>
    </div>
  );
};

export default Index;