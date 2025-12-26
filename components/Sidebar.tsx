import React from 'react';
import { GraduationCap, Calculator, Trophy, ChevronLeft } from 'lucide-react';
import { TOTAL_GRADUATION_CREDITS } from '../data';
import { AcademicYear } from '../types';

interface SidebarProps {
  totalCredits: number;
  yearStatus: { name: AcademicYear; progress: number };
  onOpenCalculator: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ totalCredits, yearStatus, onOpenCalculator }) => {
  const percentage = Math.min(100, (totalCredits / TOTAL_GRADUATION_CREDITS) * 100);

  const steps = [
    { credits: 300, label: 'تخرج', color: 'text-yellow-400', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]' },
    { credits: 220, label: 'سنة 5', color: 'text-emerald-400', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.4)]' },
    { credits: 160, label: 'سنة 4', color: 'text-blue-400', glow: 'shadow-[0_0_10px_rgba(96,165,250,0.4)]' },
    { credits: 100, label: 'سنة 3', color: 'text-purple-400', glow: 'shadow-[0_0_10px_rgba(192,132,252,0.4)]' },
    { credits: 40, label: 'سنة 2', color: 'text-rose-400', glow: 'shadow-[0_0_10px_rgba(251,113,133,0.4)]' },
    { credits: 0, label: 'البداية', color: 'text-slate-500', glow: '' },
  ];

  return (
    <>
      {/* Mobile Top Header (Sticky) */}
      <div className="md:hidden sticky top-0 z-50 bg-ite-800/90 backdrop-blur-xl border-b border-ite-700 p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ite-accent/20 rounded-xl flex items-center justify-center">
             <GraduationCap className="text-ite-accent" size={24} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">مسار ITE</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-ite-success font-bold px-1.5 py-0.5 bg-ite-success/10 rounded uppercase">{yearStatus.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">{totalCredits} وحدة</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onOpenCalculator}
          className="p-2.5 rounded-xl bg-ite-700 text-ite-accent border border-ite-700 active:scale-95 transition-all"
        >
          <Calculator size={20} />
        </button>
      </div>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex w-80 bg-ite-800 border-l border-ite-700 flex-shrink-0 flex-col h-screen sticky top-0 overflow-y-auto no-scrollbar shadow-2xl">
        <div className="p-6 border-b border-ite-700 bg-ite-800/95 backdrop-blur z-10 sticky top-0">
          <h1 className="text-2xl font-bold text-ite-accent flex items-center gap-2">
            <GraduationCap /> مسار ITE
          </h1>
          <p className="text-slate-400 text-xs mt-1">مستشار الترفع الأكاديمي الذكي</p>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-8">
          <div className="bg-gradient-to-br from-ite-800 to-ite-900 rounded-2xl p-5 border border-ite-700 shadow-lg relative overflow-hidden group">
            <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">الوضع الأكاديمي الحالي</h2>
            <div className="text-2xl font-bold text-white mb-1">{yearStatus.name}</div>
            <div className="w-full bg-ite-700/50 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-ite-success h-full transition-all duration-1000 ease-out" style={{ width: `${yearStatus.progress * 100}%` }}></div>
            </div>
            <div className="mt-3 text-xs text-slate-400 flex justify-between">
              <span>{totalCredits} وحدة</span>
              <span>الهدف القادم: {
                 totalCredits < 40 ? '40' : 
                 totalCredits < 100 ? '100' :
                 totalCredits < 160 ? '160' :
                 totalCredits < 220 ? '220' : '300'
              }</span>
            </div>
          </div>

          <div className="bg-ite-900/40 rounded-3xl p-6 border border-ite-700/50 relative flex flex-col items-center shadow-inner">
            <h3 className="text-[10px] font-bold text-slate-400 mb-8 w-full text-center uppercase tracking-widest flex items-center justify-center gap-2">
               <Trophy size={12} className="text-yellow-500" />
               مسار التقدم الكلي
            </h3>
            <div className="relative w-full max-w-[200px] h-[300px]">
               <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-ite-800 rounded-full"></div>
               <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1 bg-ite-accent rounded-full transition-all duration-1000" style={{ height: `${percentage}%` }}></div>
               {steps.map((step) => (
                   <div key={step.credits} className="absolute w-full left-0 flex items-center justify-between" style={{ bottom: `${(step.credits / 300) * 100}%`, transform: 'translateY(50%)' }}>
                      <div className={`w-[40%] text-left text-[10px] font-bold ${totalCredits >= step.credits ? step.color : 'text-slate-600'}`}>{step.label}</div>
                      <div className={`z-10 w-3 h-3 rounded-full border-2 ${totalCredits >= step.credits ? `bg-ite-900 border-transparent ${step.glow}` : 'bg-ite-900 border-slate-700'}`}></div>
                      <div className={`w-[40%] text-right text-[9px] font-mono ${totalCredits >= step.credits ? 'text-slate-300' : 'text-slate-700'}`}>{step.credits}</div>
                   </div>
               ))}
            </div>
          </div>

          <button 
            onClick={onOpenCalculator}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-ite-accent text-white hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-ite-accent/25 font-bold mt-auto"
          >
            <Calculator size={20} />
            <span>حاسبة المعدل الذكية</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;