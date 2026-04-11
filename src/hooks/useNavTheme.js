import { useState, useEffect } from "react";

/**
 * useNavTheme
 * ----------
 * Centralized theme detection for fixed/floating UI elements.
 * Returns true if the element is currently over a light-colored section.
 */
export function useNavTheme(offset = 68) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      // Light sections list (sections with bright backgrounds)
      const lightSections = ['process', 'why', 'faq'];
      
      let currentIsLight = false;

      for (const id of lightSections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the element (positioned at offset from top or bottom) is within this section's bounds
          // For bottom-fixed elements like the Dock, we might need a different calculation, 
          // but usually, we want them to transition together.
          if (rect.top <= offset && rect.bottom >= 0) {
            currentIsLight = true;
            break;
          }
        }
      }
      setIsLight(currentIsLight);
    };

    window.addEventListener('scroll', checkTheme);
    checkTheme(); // Initial check
    return () => window.removeEventListener('scroll', checkTheme);
  }, [offset]);

  return isLight;
}
