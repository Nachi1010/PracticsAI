import { useState, useEffect, useCallback } from "react";
import { Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getImagePath } from "@/App";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuToggle: () => void;
}

const translations = {
  en: {
    toggleLanguage: "עברית",
    menuLabel: "Toggle navigation menu",
    languageLabel: "Switch to Hebrew"
  },
  he: {
    toggleLanguage: "English",
    menuLabel: "פתח/סגור תפריט",
    languageLabel: "החלף לאנגלית"
  }
} as const;

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { currentLang, setCurrentLang } = useLanguage();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const t = translations[currentLang];

  // הגדרות קבועות וערכים מדויקים עבור ההידר
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const transitionDuration = "300ms"; // מהירות אחידה בכל סוגי המכשירים
  const headerHeight = scrolled ? '3rem' : '4rem'; // גבהים ספציפיים ולא התקנים יחסיים
  
  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-md"
      role="banner"
      style={{ 
        transition: `all ${transitionDuration} ease-out`,
        height: headerHeight,
        backgroundColor: scrolled ? 'rgba(30, 41, 59, 0.9)' : 'rgb(30, 41, 59)',
        willChange: 'transform, height, background-color',
        transform: 'translateZ(0)',
        display: 'flex',
        alignItems: 'center',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-dark-light/20 text-high-contrast"
            style={{
              transition: `all ${transitionDuration} ease-out`,
              height: scrolled ? '2.25rem' : '2.75rem',
              width: scrolled ? '2.25rem' : '2.75rem',
            }}
            onClick={onMenuToggle}
            aria-label={t.menuLabel}
          >
            <Menu 
              style={{
                transition: `all ${transitionDuration} ease-out`,
                height: scrolled ? '1.25rem' : '1.5rem',
                width: scrolled ? '1.25rem' : '1.5rem',
              }}
              aria-hidden="true" 
            />
          </Button>
          <Link 
            to="/" 
            className="flex items-center hover:opacity-90 transition-opacity"
            aria-label="Home"
          >
            <img 
              src={getImagePath("/images/2.png")}
              alt="Pixel"
              style={{
                width: 'auto',
                transition: `all ${transitionDuration} ease-out`,
                height: scrolled ? '1.75rem' : '2.25rem'
              }}
            />
          </Link>
        </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentLang(currentLang === "en" ? "he" : "en")}
            className="text-high-contrast hover:bg-dark-light/20 transition-colors"
            aria-label={t.languageLabel}
          >
            <Globe className="h-5 w-5 mr-2" aria-hidden="true" />
            {t.toggleLanguage}
          </Button>
      </div>
    </header>
  );
};