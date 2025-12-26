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
    <div className="sticky top-0 z-30 bg-ite-900/95 backdrop-blur pt-2 pb-4 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
      <div 
        ref={tabsRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map(cat => (
          <button
            key={cat.id}
            data-active={activeTab === cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${
              activeTab === cat.id 
                ? 'bg-ite-accent text-white border-ite-accent shadow-lg shadow-ite-accent/25' 
                : 'bg-ite-800/50 text-slate-400 border-transparent hover:bg-ite-800 hover:text-slate-200 hover:border-ite-700'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-ite-900 to-transparent pointer-events-none md:hidden"></div>
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-ite-900 to-transparent pointer-events-none md:hidden"></div>
    </div>
  );
};

export default NavigationTabs;