import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PomodoroTimer from '@/components/PomodoroTimer';

const Index = () => {
  const [progress, setProgress] = useState(0);

  const handleProgressChange = useCallback((newProgress: number) => {
    setProgress(newProgress);
  }, []);

  // Aura height grows from bottom to fully cover screen as timer progresses
  const auraHeight = 60 + progress * 60; // Start at 40%, grow to 100%
  
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
      inner: 'hsla(283, 55%, 55%, 0.70)',
      middle: 'hsla(243, 55%, 45%, 0.40)',
      outer: 'hsla(280, 40%, 35%, 0.06)',
      opacity: getLayerOpacity(0.12, 0.3),
      blur: 50
    },
    {
      // Golden orange layer
      inner: 'hsla(292, 85%, 55%, 0.80)',
      middle: 'hsla(206, 54%, 63%, 0.45)',
      outer: 'hsla(214, 52%, 60%, 0.20)',
      opacity: getLayerOpacity(0.4, 0.6),
      blur: 45
    },
    {
      // Bright yellow layer
      inner: 'hsla(42, 90%, 60%, 0.85)',
      middle: 'hsla(42, 85%, 55%, 0.5)',
      outer: 'hsla(210, 65%, 54%, 0.46)',
      opacity: getLayerOpacity(0.55, 0.75),
      blur: 35
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-[hsl(234,32%,12%)]">
      {/* Layered sunrise aura - each color layer fades in additively */}
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          className="fixed left-[-10%] right-[-10%] bottom-[-10%] pointer-events-none"
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
        className="fixed left-[-10%] right-[-10%] bottom-0 pointer-events-nonee"
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
      <p 
        className="italic mt-8 text-sm text-center max-w-xs relative z-10 transition-colors duration-1000"
        style={{ color: progress > 0.5 ? 'hsla(0, 0%, 100%, 0.86)' : 'hsla(0, 0%, 100%, 0.4)' }}
      >
        Enjoy the view
      </p>
    </div>
  );
};

export default Index;