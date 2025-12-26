import React, { useState, useMemo } from 'react';
import { Calculator, X, CircleAlert, CircleHelp, Equal, ArrowRight, Sparkles } from 'lucide-react';

interface GradeCalculatorProps {
  onClose: () => void;
}

const GradeCalculator: React.FC<GradeCalculatorProps> = ({ onClose }) => {
  const [practical, setPractical] = useState<string>('');
  const [exam, setExam] = useState<string>('');

  const handleInput = (
    val: string, 
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      const num = parseFloat(val);
      if (val === '' || (num <= 100)) {
        setter(val);
      }
    }
  };

  const pScore = parseFloat(practical) || 0;
  const eScore = parseFloat(exam) || 0;
  
  const weightedSum = (pScore * 0.3) + (eScore * 0.7);
  const finalScore = Math.ceil(weightedSum);

  const isDirectPass = finalScore >= 60;
  const isHelpEligible = finalScore === 58 || finalScore === 59;
  const isPassing = isDirectPass || isHelpEligible;

  // Smart Suggestions Logic
  const suggestions = useMemo(() => {
    // If only practical is entered
    if (practical !== '' && exam === '') {
      const neededFor60 = Math.ceil((60 - (pScore * 0.3)) / 0.7);
      const neededFor58 = Math.ceil((57.0001 - (pScore * 0.3)) / 0.7);
      return {
        type: 'exam',
        pass: Math.max(0, Math.min(100, neededFor60)),
        help: Math.max(0, Math.min(100, neededFor58))
      };
    }
    // If only exam is entered
    if (exam !== '' && practical === '') {
      const neededFor60 = Math.ceil((60 - (eScore * 0.7)) / 0.3);
      const neededFor58 = Math.ceil((57.0001 - (eScore * 0.7)) / 0.3);
      return {
        type: 'practical',
        pass: Math.max(0, Math.min(100, neededFor60)),
        help: Math.max(0, Math.min(100, neededFor58))
      };
    }
    return null;
  }, [practical, exam, pScore, eScore]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-ite-800 border-t md:border border-ite-700 rounded-t-[2.5rem] md:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in slide-in-from-bottom-4 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-ite-accent/20 rounded-xl flex items-center justify-center">
              <Calculator className="text-ite-accent" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white">حاسبة المحصلة الذكية</h2>
          </div>
          <p className="text-slate-400 text-sm mb-8 font-medium">حساب دقيق للمحصلة مع توقع ذكي للنجاح والمساعدة</p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex justify-between">
                  <span>علامة العملي (30%)</span>
                  {practical !== '' && <span className="text-ite-accent">{(pScore * 0.3).toFixed(1)} محصلة</span>}
                </label>
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={practical}
                  onChange={(e) => handleInput(e.target.value, setPractical)}
                  placeholder="مثلاً: 85"
                  className="w-full bg-ite-900 border-2 border-ite-700/50 rounded-2xl px-5 py-4 text-xl font-bold text-white placeholder-slate-700 focus:outline-none focus:border-ite-accent transition-all text-center"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex justify-between">
                  <span>علامة الامتحان (70%)</span>
                  {exam !== '' && <span className="text-ite-accent">{(eScore * 0.7).toFixed(1)} محصلة</span>}
                </label>
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={exam}
                  onChange={(e) => handleInput(e.target.value, setExam)}
                  placeholder="مثلاً: 60"
                  className="w-full bg-ite-900 border-2 border-ite-700/50 rounded-2xl px-5 py-4 text-xl font-bold text-white placeholder-slate-700 focus:outline-none focus:border-ite-accent transition-all text-center"
                />
              </div>
            </div>

            {/* Smart Prediction Box (Muzallal / Highlighted) */}
            {suggestions && (
               <div className="bg-ite-accent/10 border-2 border-ite-accent/30 rounded-3xl p-5 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} className="text-ite-accent animate-pulse" />
                    <span className="text-sm font-black text-white">توقعات النجاح الذكية:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-ite-900/60 p-3 rounded-2xl border border-ite-700">
                      <span className="text-[10px] block text-slate-500 font-bold mb-1">للنجاح (60)</span>
                      <span className="text-lg font-black text-ite-accent">
                         تحتاج {suggestions.pass} <span className="text-xs text-slate-400 font-normal">في {suggestions.type === 'exam' ? 'النظري' : 'العملي'}</span>
                      </span>
                    </div>
                    <div className="bg-ite-900/60 p-3 rounded-2xl border border-ite-700">
                      <span className="text-[10px] block text-slate-500 font-bold mb-1">بالمساعدة (58)</span>
                      <span className="text-lg font-black text-ite-success">
                         تحتاج {suggestions.help} <span className="text-xs text-slate-400 font-normal">في {suggestions.type === 'exam' ? 'النظري' : 'العملي'}</span>
                      </span>
                    </div>
                  </div>
               </div>
            )}
            
            <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 flex items-start gap-3">
              <CircleAlert size={18} className="text-rose-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                تُجبر المحصلة إلى أقرب رقم صحيح. درجات المساعدة ترفع الـ 58 و 59 إلى 60 تلقائياً (بحد أقصى مادتين في الفصل الدراسي الواحد).
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-ite-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">المحصلة النهائية</span>
                <div className="flex items-center gap-2">
                  {isDirectPass ? (
                    <span className="px-3 py-1 bg-ite-success/20 text-ite-success text-[10px] font-black rounded-lg border border-ite-success/30">ناجح مباشرة</span>
                  ) : isHelpEligible ? (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black rounded-lg border border-blue-500/30">ناجح بالمساعدة</span>
                  ) : (
                    <span className="px-3 py-1 bg-rose-500/20 text-rose-400 text-[10px] font-black rounded-lg border border-rose-500/30">تحتاج للمزيد</span>
                  )}
                </div>
              </div>
              <div className={`text-6xl font-black font-mono transition-colors ${isPassing ? 'text-white' : 'text-slate-700'}`}>
                {finalScore}
              </div>
            </div>
            
            <div className="w-full h-3 bg-ite-900 rounded-full overflow-hidden border border-ite-700/50">
              <div 
                className={`h-full transition-all duration-700 ease-out ${isPassing ? 'bg-ite-success shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-ite-700'}`} 
                style={{ width: `${Math.min(100, finalScore)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-ite-900/80 p-5 border-t border-ite-700 flex justify-between items-center text-[10px] text-slate-500 font-bold px-8">
           <div className="flex items-center gap-2">
             <span>{(pScore * 0.3).toFixed(1)}</span>
             <span className="text-slate-700">+</span>
             <span>{(eScore * 0.7).toFixed(1)}</span>
             <Equal size={10} className="text-ite-accent mx-1"/> 
             <span className="text-slate-300">{weightedSum.toFixed(2)}</span>
           </div>
           <div className="flex items-center gap-2 text-ite-accent">
             <ArrowRight size={12} />
             <span className="text-sm font-black">{finalScore}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;