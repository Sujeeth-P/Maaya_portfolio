import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavTheme } from "../../hooks/useNavTheme";

export default function TiltedDock({ items }) {
  const isLight = useNavTheme(window.innerHeight - 100);
  const [hovered, setHovered] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className={cn(
          "flex gap-7 px-6 py-5 rounded-3xl backdrop-blur-2xl border transition-all duration-500",
          isLight 
            ? "bg-white/40 border-black/10 shadow-[0_15px_40px_rgba(0,0,0,0.15)]" 
            : "bg-black/30 border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.35)]"
        )}
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: 18, // stage tilt
          rotateY: mouse.x * 10, // subtle parallax left/right
        }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="relative flex flex-col items-center justify-center cursor-pointer"
            onHoverStart={() => setHovered(item.id)}
            onHoverEnd={() => setHovered(null)}
            onClick={() => {
              if (item.onClick) item.onClick();
              if (item.href) window.location.hash = item.href;
            }}
          >
            {/* Icon */}
            <motion.div
              animate={{
                rotateX: hovered === item.id ? -10 : 0,
                rotateY: hovered === item.id ? 10 : 0,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className={cn(
                "transition-colors duration-500",
                isLight ? "text-gray-900" : "text-gray-100"
              )}
            >
              {item.icon}
            </motion.div>

            {/* Label */}
            <motion.span
              className={cn(
                "absolute -bottom-8 text-xs font-medium transition-colors duration-500",
                isLight ? "text-gray-800" : "text-gray-200"
              )}
              animate={{ opacity: hovered === item.id ? 1 : 0, y: hovered === item.id ? 0 : 5 }}
              transition={{ duration: 0.3 }}
            >
              {item.label}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
