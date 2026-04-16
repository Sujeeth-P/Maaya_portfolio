import React, { useState, useEffect, useRef } from "react";
import { useNavTheme } from "../hooks/useNavTheme";

export default function Navbar({ onOpenModal }) {
  const isLight = useNavTheme(68);
  const [shrunk, setShrunk] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const navRef = useRef(null);

  // Detect when user has scrolled past the Services section
  useEffect(() => {
    const checkScroll = () => {
      const servicesEl = document.getElementById("hero");
      if (!servicesEl) return;

      // Shrink once the bottom of the services section has passed the top of the viewport
      const rect = servicesEl.getBoundingClientRect();
      setShrunk(rect.bottom < 0);
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  // Collapsed = shrunk AND not hovering
  const isCollapsed = shrunk && !hovered;

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeoutRef.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    // Small delay before collapsing again so it feels intentional
    hoverTimeoutRef.current = setTimeout(() => {
      setHovered(false);
    }, 300);
  };

  const navItems = [
    { id: 1, label: "Services", href: "#services" },
    { id: 2, label: "Process", href: "#process" },
    { id: 3, label: "About", href: "#why" },
    { id: 4, label: "Clients", href: "#clients" },
    { id: 5, label: "FAQ", href: "#faq" },
    { id: 6, label: "Consult", onClick: onOpenModal },
  ];

  return (
    <>
      {/* ── Top-left Navbar ──────────────────────────────────────────── */}
      <nav
        ref={navRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "fixed",
          top: "20px",
          left: "24px",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: "0px",
          // Pill / capsule container that expands/collapses
          background: isCollapsed
            ? "transparent"
            : isLight
            ? "rgba(250,250,247,0.85)"
            : "rgba(10,10,10,0.75)",
          backdropFilter: isCollapsed ? "none" : "blur(14px)",
          WebkitBackdropFilter: isCollapsed ? "none" : "blur(14px)",
          borderRadius: "999px",
          border: isCollapsed
            ? "none"
            : isLight
            ? "1px solid rgba(0,0,0,0.08)"
            : "1px solid rgba(255,255,255,0.08)",
          padding: isCollapsed ? "0" : "8px 20px 8px 16px",
          boxShadow: isCollapsed
            ? "none"
            : isLight
            ? "0 4px 24px rgba(0,0,0,0.10)"
            : "0 4px 24px rgba(0,0,0,0.40)",
          // Smooth expand/collapse
          transition:
            "padding 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
          overflow: "visible",
          cursor: "default",
        }}
      >
        {/* Logo — always visible */}
        <a
          href="#"
          style={{
            fontFamily: "var(--font-display, 'Inter', sans-serif)",
            fontSize: "21px",
            fontWeight: 800,
            textDecoration: "none",
            letterSpacing: "-0.04em",
            color: isLight ? "#0A0A0A" : "#FAFAF7",
            whiteSpace: "nowrap",
            transition: "color 0.3s ease",
            lineHeight: 1,
            // When collapsed, give it a glassy pill feel
            ...(isCollapsed && {
              background: isLight
                ? "rgba(250,250,247,0.85)"
                : "rgba(10,10,10,0.75)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: isLight
                ? "1px solid rgba(0,0,0,0.08)"
                : "1px solid rgba(255,255,255,0.08)",
              borderRadius: "999px",
              padding: "8px 18px",
              boxShadow: isLight
                ? "0 4px 24px rgba(0,0,0,0.10)"
                : "0 4px 24px rgba(0,0,0,0.40)",
            }),
          }}
        >
          Maayay<span style={{ color: "#084734" }}>.</span>
        </a>

        {/* Nav links — revealed on hover when shrunk, always visible otherwise */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            // Slide + fade in/out
            maxWidth: isCollapsed ? "0px" : "600px",
            opacity: isCollapsed ? 0 : 1,
            overflow: "hidden",
            pointerEvents: isCollapsed ? "none" : "auto",
            transition:
              "max-width 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease",
            marginLeft: isCollapsed ? "0" : "12px",
          }}
        >
          {navItems.map((item) =>
            item.href ? (
              <a
                key={item.id}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  color: isLight ? "#0A0A0A" : "#FAFAF7",
                  transition: "background 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isLight
                    ? "rgba(0,0,0,0.06)"
                    : "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {item.label}
              </a>
            ) : (
              <button
                key={item.id}
                onClick={item.onClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  background: "#084734",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s ease, transform 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#CEF17B";
                  e.currentTarget.style.color = "#084734";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#084734";
                  e.currentTarget.style.color = "#E5FCCD";
                }}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      </nav>
    </>
  );
}
