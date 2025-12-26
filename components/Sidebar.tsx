import React from 'react';
import { GraduationCap, Calculator, Trophy } from 'lucide-react';
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
      {/* Mobile Top Header (Fixed Height: 72px) */}
      <div className="md:hidden sticky top-0 z-[60] h-[72px] w-full bg-ite-900 border-b border-ite-700 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-ite-accent/20 rounded-2xl flex items-center justify-center border border-ite-accent/30">
             <GraduationCap className="text-ite-accent" size={26} />
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-tight tracking-tight">مسار ITE</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-ite-success font-bold px-1.5 py-0.5 bg-ite-success/10 rounded border border-ite-success/20">{yearStatus.name}</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">{totalCredits} وحدة</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onOpenCalculator}
          className="w-11 h-11 rounded-2xl bg-ite-800 text-ite-accent border border-ite-700 flex items-center justify-center active:scale-90 transition-all shadow-sm"
        >
          <Calculator size={22} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 bg-ite-800 border-l border-ite-700 flex-shrink-0 flex-col h-screen sticky top-0 overflow-y-auto no-scrollbar shadow-2xl">
        <div className="p-6 border-b border-ite-700 bg-ite-800/95 backdrop-blur z-10 sticky top-0">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="text-ite-accent" /> مسار ITE
          </h1>
          <p className="text-slate-400 text-xs mt-1">مستشار الترفع الأكاديمي الذكي</p>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-8">
          <div className="bg-gradient-to-br from-ite-800 to-ite-900 rounded-3xl p-6 border border-ite-700 shadow-lg relative overflow-hidden group">
            <h2 className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3">الوضع الأكاديمي</h2>
            <div className="text-2xl font-black text-white mb-1">{yearStatus.name}</div>
            <div className="w-full bg-ite-700/50 h-2 rounded-full mt-4 overflow-hidden border border-ite-700/30">
              <div className="bg-ite-success h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${yearStatus.progress * 100}%` }}></div>
            </div>
            <div className="mt-4 text-[11px] text-slate-400 font-bold flex justify-between">
              <span className="bg-ite-900 px-2 py-0.5 rounded-lg border border-ite-700">{totalCredits} وحدة منجزة</span>
            </div>
          </div>

          <div className="bg-ite-900/40 rounded-[2rem] p-6 border border-ite-700/50 relative flex flex-col items-center shadow-inner">
            <h3 className="text-[10px] font-black text-slate-500 mb-8 w-full text-center uppercase tracking-widest flex items-center justify-center gap-2">
               <Trophy size={14} className="text-yellow-500" />
               خريطة التخرج
            </h3>
            <div className="relative w-full max-w-[180px] h-[280px]">
               <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 bg-ite-800 rounded-full"></div>
               <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1.5 bg-ite-accent rounded-full transition-all duration-1000" style={{ height: `${percentage}%` }}></div>
               {steps.map((step) => (
                   <div key={step.credits} className="absolute w-full left-0 flex items-center justify-between" style={{ bottom: `${(step.credits / 300) * 100}%`, transform: 'translateY(50%)' }}>
                      <div className={`w-[40%] text-left text-[11px] font-black ${totalCredits >= step.credits ? step.color : 'text-slate-600'}`}>{step.label}</div>
                      <div className={`z-10 w-4 h-4 rounded-full border-[3px] transition-all duration-500 ${totalCredits >= step.credits ? `bg-ite-900 border-ite-accent ${step.glow}` : 'bg-ite-900 border-ite-700'}`}></div>
                      <div className={`w-[40%] text-right text-[10px] font-mono font-bold ${totalCredits >= step.credits ? 'text-slate-300' : 'text-slate-700'}`}>{step.credits}</div>
                   </div>
               ))}
            </div>
          </div>

          <button 
            onClick={onOpenCalculator}
            className="flex items-center justify-center gap-3 w-full py-4 px-4 rounded-2xl bg-ite-accent text-white hover:bg-blue-600 active:scale-95 transition-all shadow-xl shadow-ite-accent/25 font-black text-sm mt-auto"
          >
            <Calculator size={20} />
            <span>حاسبة المحصلة الذكية</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;