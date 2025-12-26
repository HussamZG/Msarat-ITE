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
    <aside className="w-full md:w-80 bg-ite-800 border-l border-ite-700 flex-shrink-0 flex flex-col h-auto md:h-screen overflow-y-auto sticky top-0 z-20 shadow-2xl custom-scrollbar">
      {/* Header */}
      <div className="p-6 border-b border-ite-700 bg-ite-800/95 backdrop-blur z-10 sticky top-0">
        <h1 className="text-2xl font-bold text-ite-accent flex items-center gap-2">
          <GraduationCap /> مسار ITE
        </h1>
        <p className="text-slate-400 text-xs mt-1">مستشار الترفع الأكاديمي الذكي</p>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-8">
        
        {/* Status Card */}
        <div className="bg-gradient-to-br from-ite-800 to-ite-900 rounded-2xl p-5 border border-ite-700 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-ite-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-ite-accent/10 transition-colors duration-500"></div>
          <h2 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">الوضع الأكاديمي الحالي</h2>
          <div className="flex items-baseline gap-2 mb-1">
             <div className="text-2xl font-bold text-white">{yearStatus.name}</div>
          </div>
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

        {/* Ladder Progress Visualization */}
        <div className="bg-ite-900/40 rounded-3xl p-6 border border-ite-700/50 relative flex flex-col items-center shadow-inner">
          <h3 className="text-[10px] font-bold text-slate-400 mb-8 w-full text-center uppercase tracking-widest flex items-center justify-center gap-2">
             <Trophy size={12} className="text-yellow-500" />
             مسار التقدم الكلي
          </h3>
          
          <div className="relative w-full max-w-[200px] h-[300px] mb-2">
             {/* Central Rail */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 bg-ite-800 rounded-full shadow-inner"></div>
             
             {/* Progress Fill */}
             <div 
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1.5 bg-gradient-to-t from-ite-accent via-purple-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                style={{ height: `${percentage}%` }}
             ></div>

             {/* Steps */}
             {steps.map((step) => {
                 const stepPercent = (step.credits / 300) * 100;
                 const isPassed = totalCredits >= step.credits;
                 
                 return (
                     <div 
                        key={step.credits}
                        className="absolute w-full left-0 flex items-center justify-between pointer-events-none"
                        style={{ bottom: `${stepPercent}%`, transform: 'translateY(50%)' }}
                     >
                        {/* Right Label (Visual Left) */}
                        <div className={`w-[42%] text-left text-[10px] font-bold transition-all duration-500 ${isPassed ? `${step.color} scale-105` : 'text-slate-600'}`}>
                            {step.label}
                        </div>

                        {/* Step Node */}
                        <div className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-700 flex items-center justify-center ${
                            isPassed 
                                ? `bg-ite-900 border-transparent ${step.glow} scale-125` 
                                : 'bg-ite-900 border-slate-700'
                        }`}>
                            {isPassed && <div className={`w-2 h-2 rounded-full ${step.color.replace('text-', 'bg-')}`}></div>}
                        </div>

                        {/* Left Label (Visual Right) */}
                        <div className={`w-[42%] text-right text-[9px] font-mono transition-colors duration-500 ${isPassed ? 'text-slate-300' : 'text-slate-700'}`}>
                            {step.credits}
                        </div>
                     </div>
                 );
             })}

             {/* Climber Indicator */}
             <div 
                className="absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 ease-out group cursor-help"
                style={{ bottom: `${percentage}%`, transform: 'translate(-50%, 50%)' }}
             >
                <div className="relative">
                   {/* Tooltip Badge */}
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-ite-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] whitespace-nowrap border border-white/50">
                      {Math.floor(percentage)}%
                   </div>
                   {/* Arrow */}
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-2 h-2 bg-white rotate-45"></div>
                   
                   {/* Glowing Head */}
                   <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] animate-pulse"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Calculator Button */}
        <button 
          onClick={onOpenCalculator}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-ite-700/30 hover:bg-ite-700 hover:text-white text-slate-300 border border-ite-700 hover:border-ite-600 transition-all group mt-auto"
        >
          <Calculator size={20} className="text-ite-accent group-hover:scale-110 transition-transform" />
          <span className="font-semibold">حاسبة المعدل الذكية</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;