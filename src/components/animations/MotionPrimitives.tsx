"use client";
import { motion, HTMLMotionProps } from "motion/react";
import { ReactNode, forwardRef } from "react";

// ============================================
// LAYOUT ANIMATIONS
// ============================================

export const StaggerContainer = forwardRef<HTMLDivElement, { 
  children: ReactNode; 
  className?: string; 
  delay?: number;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right";
} & HTMLMotionProps<"div">>(
  ({ children, className = "", delay = 0, stagger = 0.08, direction = "up", ...props }, ref) => {
    const variants = {
      up: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } },
      down: { hidden: { opacity: 0, y: -20 }, show: { opacity: 1, y: 0 } },
      left: { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } },
      right: { hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } },
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: stagger,
              delayChildren: delay,
            },
          },
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerContainer.displayName = "StaggerContainer";

export const StaggerItem = forwardRef<HTMLDivElement, {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
} & HTMLMotionProps<"div">>(
  ({ children, className = "", delay = 0, direction = "up", ...props }, ref) => {
    const variants = {
      up: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } },
      down: { hidden: { opacity: 0, y: -20 }, show: { opacity: 1, y: 0 } },
      left: { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } },
      right: { hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } },
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={variants[direction]}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerItem.displayName = "StaggerItem";

// ============================================
// PAGE TRANSITIONS
// ============================================

export function PageTransition({ 
  children, 
  className = "", 
  mode, 
  duration = 0.3 
}: { 
  children: ReactNode; 
  className?: string;
  mode?: "wait" | "sync" | "popLayout";
  duration?: number;
}): React.ReactElement {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ display: "block" }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// MICRO-INTERACTIONS
// ============================================

export const HoverLift = forwardRef<HTMLDivElement, {
  children: ReactNode;
  className?: string;
  lift?: number;
} & HTMLMotionProps<"div">>(
  ({ children, className = "", lift = -4, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={className}
      whileHover={{ y: lift, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

HoverLift.displayName = "HoverLift";

export const TapScale = forwardRef<HTMLButtonElement, {
  children: ReactNode;
  className?: string;
  scale?: number;
} & HTMLMotionProps<"button">>(
  ({ children, className = "", scale = 0.95, ...props }, ref) => (
    <motion.button
      ref={ref}
      className={className}
      whileTap={{ scale, transition: { duration: 0.1 } }}
      {...props}
    >
      {children}
    </motion.button>
  )
);

TapScale.displayName = "TapScale";

export const FocusRing = forwardRef<HTMLInputElement, {
  className?: string;
  ringColor?: string;
} & HTMLMotionProps<"input">>(
  ({ className = "", ringColor = "yellow-400", ...props }, ref) => (
    <motion.input
      ref={ref}
      className={className}
      whileFocus={{ 
        boxShadow: `0 0 0 2px ${ringColor}40`,
        transition: { duration: 0.15 }
      }}
      {...props}
    />
  )
);

FocusRing.displayName = "FocusRing";

// ============================================
// ENTRANCE ANIMATIONS
// ============================================

export function FadeIn({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.3 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number;
  duration?: number;
}): React.ReactElement {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ 
  children, 
  className = "", 
  direction = "up", 
  delay = 0, 
  distance = 30,
  duration = 0.4 
}: { 
  children: ReactNode; 
  className?: string; 
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  distance?: number;
  duration?: number;
}): React.ReactElement {
  const dir = direction || "up";
  const variants = {
    left: { hidden: { x: -distance, opacity: 0 }, show: { x: 0, opacity: 1 } },
    right: { hidden: { x: distance, opacity: 0 }, show: { x: 0, opacity: 1 } },
    up: { hidden: { y: distance, opacity: 0 }, show: { y: 0, opacity: 1 } },
    down: { hidden: { y: -distance, opacity: 0 }, show: { y: 0, opacity: 1 } },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={variants[dir]}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.3,
  fromScale = 0.95 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number;
  duration?: number;
  fromScale?: number;
}): React.ReactElement {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: fromScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function RotateIn({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.4 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number;
  duration?: number;
}): React.ReactElement {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, rotate: -180, scale: 0.8 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// MODAL / DRAWER ANIMATIONS
// ============================================

export function ModalBackdrop({ 
  isOpen, 
  onClose, 
  children, 
  className = "" 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  children: ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      />
      <motion.div
        className="w-full max-w-md bg-surface-soft border border-hairline rounded-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={isOpen ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Drawer({ 
  isOpen, 
  onClose, 
  children, 
  side = "right",
  className = "" 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right" | "bottom";
  className?: string;
}): React.ReactElement {
  const sideVariants = {
    left: { hidden: { x: "-100%" }, show: { x: 0 } },
    right: { hidden: { x: "100%" }, show: { x: 0 } },
    bottom: { hidden: { y: "100%" }, show: { y: 0 } },
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex ${className}`}
      initial={false}
      animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={`flex-1 bg-surface-soft border-l border-hairline ${side === "bottom" ? "border-t inset-x-0 bottom-0 h-[70%]" : "h-full"}`}
        initial="hidden"
        animate={isOpen ? "show" : "hidden"}
        exit="hidden"
        variants={sideVariants[side] || sideVariants.right}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ============================================
// TOAST / NOTIFICATION ANIMATIONS
// ============================================

export function Toast({ 
  isOpen, 
  onClose, 
  children, 
  className = "" 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  children: ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 ${className}`}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={isOpen ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 100, scale: 0.9 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 150 }}
    >
      <div className="bg-surface-elevated border border-hairline rounded-lg p-4 shadow-xl max-w-sm">
        {children}
        <motion.button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted hover:text-ink transition-colors"
          whileTap={{ scale: 0.8 }}
        >
          ×
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================
// LIST ANIMATIONS
// ============================================

export function AnimatedList({ 
  items, 
  renderItem, 
  className = "",
  stagger = 0.05,
  direction = "vertical"
}: { 
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  className?: string;
  stagger?: number;
  direction?: "vertical" | "horizontal";
}): React.ReactElement {
  const dir = direction || "vertical";
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          variants={{
            hidden: dir === "vertical" ? { opacity: 0, y: 20 } : { opacity: 0, x: 20 },
            show: { opacity: 1, y: 0, x: 0 },
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================
// PROGRESS / LOADING ANIMATIONS
// ============================================

export function ProgressRing({ 
  progress = 0, 
  size = 48, 
  strokeWidth = 4,
  className = "",
  color = "yellow-400"
}: { 
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
}): React.ReactElement {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-zinc-800"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={color}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </motion.svg>
  );
}

export function Spinner({ 
  size = 24, 
  className = "",
  color = "yellow-400"
}: { 
  size?: number;
  className?: string;
  color?: string;
}): React.ReactElement {
  return (
    <motion.svg
      className={`${color} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
      />
    </motion.svg>
  );
}

// ============================================
// TEXT ANIMATIONS
// ============================================

export function Typewriter({ 
  text, 
  speed = 30, 
  className = "",
  cursor = true 
}: { 
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
}): React.ReactElement {
  return (
    <motion.span
      className={className}
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ 
        duration: text.length * speed / 1000, 
        ease: "linear" 
      }}
      style={{ overflow: "hidden", whiteSpace: "nowrap", display: "inline-block" }}
    >
      {text}
      {cursor && (
        <motion.span
          className="ml-1 text-yellow-400"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </motion.span>
  );
}

export function TextReveal({ 
  children, 
  className = "",
  delay = 0,
  stagger = 0.03
}: { 
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}): React.ReactElement {
  const text = Array.isArray(children) ? children[0] : children;
  const words = typeof text === "string" ? text.split(" ") : [text];

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + i * stagger, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {word} 
        </motion.span>
      ))}
    </span>
  );
}

// ============================================
// CARD ANIMATIONS
// ============================================

export const AnimatedCard = forwardRef<HTMLDivElement, {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
} & HTMLMotionProps<"div">>(
  ({ children, className = "", hover = true, delay = 0, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={`border border-hairline bg-surface-card rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" } : undefined}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 0.1, 0.25, 1],
        delay 
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

AnimatedCard.displayName = "AnimatedCard";

// ============================================
// TABS ANIMATIONS
// ============================================

export function AnimatedTabs({ 
  tabs, 
  activeTab, 
  onChange, 
  className = "",
  indicatorColor = "yellow-400"
}: { 
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  indicatorColor?: string;
}): React.ReactElement {
  const activeIndex = tabs.findIndex(t => t.id === activeTab);

  return (
    <div className={`flex border-b border-hairline ${className}`}>
      <motion.div
        className={`absolute bottom-0 h-1 bg-${indicatorColor} transition-all duration-300 ease-out`}
        style={{
          width: `${100 / tabs.length}%`,
          left: `${activeIndex * (100 / tabs.length)}%`,
        }}
        layout
      />
      {tabs.map((tab, i) => (
        <motion.button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-machined relative z-10 ${
            activeTab === tab.id 
              ? "text-yellow-400" 
              : "text-muted hover:text-ink"
          }`}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
}