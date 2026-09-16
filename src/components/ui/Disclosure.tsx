"use client";
import { motion, useMotionValue } from "motion/react";
import { ChevronDown } from "lucide-react";
import { forwardRef, ReactNode, useState } from "react";

interface DisclosureProps {
  trigger: ReactNode;
  actions?: ReactNode;
  content: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  onChange?: (open: boolean) => void;
}

export const Disclosure = forwardRef<HTMLDivElement, DisclosureProps>(
  ({ trigger, actions, content, className = "", defaultOpen = false, onChange }, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const height = useMotionValue(0);

    const toggle = () => {
      const next = !isOpen;
      setIsOpen(next);
      onChange?.(next);
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ 
          overflow: "hidden",
        }}
      >
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-controls="disclosure-content"
          className="w-full flex items-center gap-3 py-3 text-left cursor-pointer"
          onClick={toggle}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
        >
          <div className="flex min-w-0 flex-1 items-center justify-between">
            {trigger}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">
              {actions}
            </div>
          )}
          <motion.div
            className="flex-shrink-0"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>
        
        <motion.div
          id="disclosure-content"
          role="region"
          aria-hidden={!isOpen}
          initial={false}
          animate={{ 
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{ overflow: "hidden" }}
        >
          <div className="py-2" ref={(el) => {
            if (el && isOpen) {
              height.set(el.scrollHeight);
            }
          }}>
            {content}
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

Disclosure.displayName = "Disclosure";

// ============================================
// ACCORDION - Multiple disclosures with single open
// ============================================

interface AccordionProps {
  items: {
    title: ReactNode;
    actions?: ReactNode;
    content: ReactNode;
    key: string;
  }[];
  className?: string;
  allowMultiple?: boolean;
}

export function Accordion({ items, className = "", allowMultiple = false }: AccordionProps) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const toggle = (key: string) => {
    setOpenKeys(prev => {
      if (allowMultiple) {
        return prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      }
      return prev.includes(key) ? [] : [key];
    });
  };

  return (
    <div className={className}>
      {items.map(item => (
        <motion.div
          key={item.key}
          className="border border-hairline bg-surface-card mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: items.indexOf(item) * 0.05 }}
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={openKeys.includes(item.key)}
            aria-controls={`accordion-content-${item.key}`}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-elevated transition-colors cursor-pointer"
            onClick={() => toggle(item.key)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(item.key); } }}
          >
            <div className="flex min-w-0 flex-1 items-center justify-between">
              {item.title}
            </div>
            {item.actions && (
              <div className="flex shrink-0 items-center gap-2">
                {item.actions}
              </div>
            )}
            <motion.div
              animate={{ rotate: openKeys.includes(item.key) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-muted" />
            </motion.div>
          </div>
          
          <motion.div
            id={`accordion-content-${item.key}`}
            role="region"
            aria-hidden={!openKeys.includes(item.key)}
            initial={{ height: 0, opacity: 0 }}
            animate={openKeys.includes(item.key) ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 border-t border-hairline">
              {item.content}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// EXPANDABLE ROW - For tables
// ============================================

interface ExpandableRowProps {
  trigger: ReactNode;
  content: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function ExpandableRow({ trigger, content, className = "", defaultOpen = false }: ExpandableRowProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div className={className} layout>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex-1">{trigger}</div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-muted" />
        </motion.div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        exit={{ height: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ overflow: "hidden" }}
      >
        <div className="py-2">{content}</div>
      </motion.div>
    </motion.div>
  );
}