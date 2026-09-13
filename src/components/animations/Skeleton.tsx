"use client";
import { motion } from "motion/react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

const pulseAnimation = {
  hidden: { opacity: 0.4 },
  visible: { opacity: 1 },
};

const waveAnimation = {
  hidden: { backgroundPosition: "-200% 0" },
  visible: { backgroundPosition: "200% 0" },
};

export function Skeleton({ 
  className = "", 
  variant = "text", 
  width = "100%", 
  height = "1rem", 
  animation = "pulse" 
}: SkeletonProps) {
  const baseStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: variant === "circular" ? "50%" : variant === "text" ? "4px" : "8px",
    backgroundColor: "#2a2a2a",
  };

  if (animation === "pulse") {
    return (
      <motion.div
        style={baseStyle}
        className={className}
        animate="visible"
        initial="hidden"
        variants={pulseAnimation}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  if (animation === "wave") {
    return (
      <motion.div
        style={{
          ...baseStyle,
          background: "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)",
          backgroundSize: "200% 100%",
        }}
        className={className}
        animate="visible"
        initial="hidden"
        variants={waveAnimation}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  return <div style={baseStyle} className={className} />;
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`border border-hairline bg-surface-card p-6 ${className}`}>
      <div className="space-y-4">
        <Skeleton variant="rectangular" width="40%" height="1.25rem" animation="wave" />
        <Skeleton variant="text" width="60%" height="1rem" animation="wave" />
        <Skeleton variant="text" width="100%" height="1rem" animation="wave" />
        <Skeleton variant="text" width="80%" height="1rem" animation="wave" />
        <div className="flex gap-2 mt-4">
          <Skeleton variant="rectangular" width="100px" height="36px" animation="pulse" />
          <Skeleton variant="rectangular" width="100px" height="36px" animation="pulse" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="border-b border-hairline py-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width="80%" height="1rem" animation="wave" />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-0">
      <div className="grid gap-4 px-4 py-3 text-xs font-bold uppercase tracking-machined text-muted" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width="60%" height="0.75rem" animation="pulse" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <motion.div
          key={i}
          className="border border-hairline bg-surface-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={48} height={48} animation="wave" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="40%" height="1.25rem" animation="wave" />
              <Skeleton variant="text" width="60%" height="1rem" animation="wave" />
            </div>
            <Skeleton variant="rectangular" width="80px" height="32px" animation="pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function DashboardCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`border border-hairline bg-surface-card p-6 ${className}`}>
      <div className="flex items-center gap-2 text-muted mb-4">
        <Skeleton variant="circular" width={16} height={16} animation="pulse" />
        <Skeleton variant="text" width="80px" height="12px" animation="wave" />
      </div>
      <Skeleton variant="text" width="120px" height="3rem" className="text-3xl font-bold" animation="wave" />
    </div>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Skeleton variant="text" width="100px" height="12px" animation="wave" className="mb-2" />
          <Skeleton variant="rectangular" width="100%" height="44px" animation="wave" />
        </motion.div>
      ))}
    </div>
  );
}

export function ModalSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 ${className}`}>
      <motion.div
        className="w-full max-w-md border border-hairline bg-surface-soft p-8"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="space-y-4 mb-8">
          <Skeleton variant="text" width="40%" height="1.5rem" animation="wave" />
          <FormSkeleton fields={4} />
        </div>
        <Skeleton variant="rectangular" width="100%" height="48px" animation="pulse" />
      </motion.div>
    </div>
  );
}