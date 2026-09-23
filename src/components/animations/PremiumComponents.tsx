"use client";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { forwardRef, ReactNode, useRef, useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  ease?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className = "", strength = 0.4, ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const isHovered = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
    const scaleSpring = useSpring(isHovered, { stiffness: 300, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * strength);
      y.set((e.clientY - centerY) * strength);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      isHovered.set(0);
    };

    const handleMouseEnter = () => {
      isHovered.set(1);
    };

    const style = {
      x: xSpring,
      y: ySpring,
      scale: useTransform(scaleSpring, [0, 1], [1, 1.02]),
    };

    return (
      <motion.button
        ref={ref}
        className={`relative overflow-hidden rounded-lg font-semibold transition-colors ${className}`}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        whileTap={{ scale: 0.97 }}
        {...props}
      >
        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          style={{ x: useTransform(xSpring, [0], [0]), y: useTransform(ySpring, [0], [0]) }}
        >
          {children}
        </motion.span>
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-xl"
          style={{ opacity: isHovered, scale: useTransform(scaleSpring, [0, 1], [0.8, 1.2]) }}
        />
      </motion.button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

// ============================================
// SPOTLIGHT CARD
// ============================================

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`relative rounded-xl border border-hairline bg-surface-card overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Spotlight gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at var(--x, 50%) var(--y, 50%), rgba(255,204,0,0.15) 0%, transparent 70%)`,
        }}
      >
        <style jsx global>{`
          .spotlight-card {
            --x: 50%;
            --y: 50%;
          }
        `}</style>
      </motion.div>
      
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
}

// ============================================
// REVEAL ON SCROLL
// ============================================

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function Reveal({ 
  children, 
  className = "", 
  direction = "up", 
  delay = 0, 
  threshold = 0.1,
  rootMargin = "0px",
  once = true 
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, reducedMotion]);

  const variants = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants[direction]}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1], 
        delay 
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// SHIMMER TEXT
// ============================================

interface ShimmerTextProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  colors?: string[];
}

export function ShimmerText({ 
  children, 
  className = "", 
  speed = 2,
  colors = ["#ffcc00", "#ffdd44", "#fff", "#ffdd44", "#ffcc00"]
}: ShimmerTextProps) {
  return (
    <motion.span
      className={`bg-clip-text text-transparent bg-[length:200%_100%] bg-gradient-to-r ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(",")})`,
      }}
      animate={{ backgroundPositionX: ["0%", "200%", "0%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

// ============================================
// FLOATING ACTION BUTTON
// ============================================

interface FloatingActionButtonProps {
  children: ReactNode;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  onClick?: () => void;
}

export function FloatingActionButton({ 
  children, 
  className = "", 
  position = "bottom-right",
  onClick 
}: FloatingActionButtonProps) {
  const positions = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6",
  };

  return (
    <motion.button
      className={`${positions[position]} z-50 rounded-full p-4 bg-yellow-400 text-black shadow-2xl shadow-yellow-400/20 ${className}`}
      whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(255,204,0,0.5)" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      animate={{ 
        boxShadow: [
          "0 4px 20px rgba(255,204,0,0.3)",
          "0 8px 30px rgba(255,204,0,0.5)",
          "0 4px 20px rgba(255,204,0,0.3)",
        ]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.button>
  );
}

// ============================================
// ANIMATED COUNTER
// ============================================

interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number;
  formatter?: (value: number) => string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ 
  value, 
  className = "", 
  prefix = "",
  suffix = ""
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const display = useSpring(count, { stiffness: 100, damping: 20 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      count.set(value);
      return;
    }
    count.set(value);
  }, [value, count, reducedMotion]);

  return (
    <span className={className}>
      {prefix}
      <motion.span
        style={{ 
          x: useTransform(display, (v) => Math.floor(v)),
        }}
      >
        {display.get().toLocaleString()}
      </motion.span>
      {suffix}
    </span>
  );
}

// Actually let's fix the counter to properly animate numbers
export function NumberCounter({ 
  value, 
  className = "", 
  duration = 1.5,
  formatter = (v: number) => v.toLocaleString(),
  prefix = "",
  suffix = ""
}: AnimatedCounterProps) {
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, reducedMotion]);

  return (
    <span className={className}>
      {prefix}
      {formatter(Math.floor(displayValue))}
      {suffix}
    </span>
  );
}