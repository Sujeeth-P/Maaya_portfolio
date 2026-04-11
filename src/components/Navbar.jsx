import React from "react";
import { Briefcase, GitBranch, User, Users, MessageCircle, HelpCircle } from "lucide-react";
import TiltedDock from "./ui/tilted-dock";
import { useNavTheme } from "../hooks/useNavTheme";

export default function Navbar({ onOpenModal }) {
  const isLight = useNavTheme(68);

  const navItems = [
    { id: 1, icon: <Briefcase size={24} />, label: "Services", href: "#services" },
    { id: 2, icon: <GitBranch size={24} />, label: "Process", href: "#process" },
    { id: 3, icon: <User size={24} />, label: "About", href: "#why" },
    { id: 4, icon: <Users size={24} />, label: "Clients", href: "#clients" },
    { id: 5, icon: <HelpCircle size={24} />, label: "FAQ", href: "#faq" },
    { 
      id: 6, 
      icon: <MessageCircle size={24} />, 
      label: "Consult", 
      onClick: onOpenModal 
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 h-[68px] bg-transparent pointer-events-none transition-colors duration-500">
        <div className="pointer-events-auto">
          <a 
            href="#" 
            className={`font-display text-[22px] font-extrabold no-underline tracking-tight transition-colors duration-300 ${
              isLight ? 'text-[#0A0A0A]' : 'text-[#FAFAF7]'
            }`}
          >
            Maayay<span className="text-teal">.</span>
          </a>
        </div>

        <div className="hidden md:block pointer-events-auto">
          {/* <button
            onClick={onOpenModal}
            className={`px-[22px] py-2.5 rounded-lg font-semibold text-sm no-underline transition-all duration-300 hover:-translate-y-px ${
              isLight 
                ? 'bg-[#0A0A0A] text-white hover:bg-[#222]' 
                : 'bg-teal text-white hover:bg-[#0bb876]'
            }`}
          >
            Get Started
          </button> */}
        </div>
      </nav>

      <TiltedDock items={navItems} />
    </>
  );
}
