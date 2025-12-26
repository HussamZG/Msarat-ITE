import React, { useRef, useEffect } from 'react';
import { BookOpen, LayoutDashboard, GraduationCap, Award, Network } from 'lucide-react';
import { CourseCategory } from '../types';

interface NavigationTabsProps {
  activeTab: CourseCategory | 'roadmap';
  setActiveTab: (tab: CourseCategory | 'roadmap') => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabsRef = useRef<HTMLDivElement>(null);

  const categories: { id: CourseCategory | 'roadmap'; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'العامة', icon: <BookOpen size={18} /> },
    { id: 'basic', label: 'الأساسية', icon: <LayoutDashboard size={18} /> },
    { id: 'specialized', label: 'التخصصية', icon: <GraduationCap size={18} /> },
    { id: 'project', label: 'المشاريع', icon: <Award size={18} /> },
    { id: 'roadmap', label: 'خريطة الأسبقيات', icon: <Network size={18} /> },
  ];

  useEffect(() => {
    if (tabsRef.current) {
      const activeElement = tabsRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="relative">
      <div 
        ref={tabsRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar touch-pan-x"
      >
        {categories.map(cat => (
          <button
            key={cat.id}
            data-active={activeTab === cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap border-2 active:scale-95 ${
              activeTab === cat.id 
                ? 'bg-ite-accent text-white border-ite-accent shadow-lg shadow-ite-accent/20' 
                : 'bg-ite-800/40 text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <span className={activeTab === cat.id ? 'animate-pulse' : ''}>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
      {/* Scroll Indicators */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-ite-900 to-transparent pointer-events-none opacity-50 md:hidden"></div>
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-ite-900 to-transparent pointer-events-none opacity-50 md:hidden"></div>
    </div>
  );
};

export default NavigationTabs;