import React, { useState, useMemo } from 'react';
import { Calculator, X, CircleAlert, Equal, ArrowRight, Sparkles, BookOpen, Languages } from 'lucide-react';

interface GradeCalculatorProps {
  onClose: () => void;
}

const GradeCalculator: React.FC<GradeCalculatorProps> = ({ onClose }) => {
  const [practical, setPractical] = useState<string>('');
  const [exam, setExam] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

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

  // Config based on course type
  const config = {
    pWeight: isEnglish ? 0.2 : 0.3,
    eWeight: isEnglish ? 0.8 : 0.7,
    passScore: isEnglish ? 50 : 60,
    helpThreshold: isEnglish ? 48 : 58
  };

  const pScore = parseFloat(practical) || 0;
  const eScore = parseFloat(exam) || 0;
  
  const weightedSum = (pScore * config.pWeight) + (eScore * config.eWeight);
  const finalScore = Math.ceil(weightedSum);

  const isDirectPass = finalScore >= config.passScore;
  const isHelpEligible = finalScore >= config.helpThreshold && finalScore < config.passScore;
  const isPassing = isDirectPass || isHelpEligible;

  const suggestions = useMemo(() => {
    if (practical !== '' && exam === '') {
      const neededForPass = Math.ceil((config.passScore - (pScore * config.pWeight)) / config.eWeight);
      const neededForHelp = Math.ceil(((config.helpThreshold - 0.999) - (pScore * config.pWeight)) / config.eWeight);
      return {
        type: 'exam',
        pass: Math.max(0, Math.min(100, neededForPass)),
        help: Math.max(0, Math.min(100, neededForHelp + 1))
      };
    }
    if (exam !== '' && practical === '') {
      const neededForPass = Math.ceil((config.passScore - (eScore * config.eWeight)) / config.pWeight);
      const neededForHelp = Math.ceil(((config.helpThreshold - 0.999) - (eScore * config.eWeight)) / config.pWeight);
      return {
        type: 'practical',
        pass: Math.max(0, Math.min(100, neededForPass)),
        help: Math.max(0, Math.min(100, neededForHelp + 1))
      };
    }
    return null;
  }, [practical, exam, pScore, eScore, isEnglish]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-ite-800 border-t md:border border-ite-700 rounded-t-[2.5rem] md:rounded-3xl shadow-2xl w-full max-w-lg relative animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[92vh] md:max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 pb-2 border-b border-ite-700/50 md:border-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ite-accent/20 rounded-xl flex items-center justify-center">
              <Calculator className="text-ite-accent" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">حاسبة المحصلة</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 pt-4">
          
          {/* Course Type Switcher */}
          <div className="flex p-1.5 bg-ite-900 rounded-2xl border border-ite-700 mb-8 gap-1.5">
            <button 
              onClick={() => setIsEnglish(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${!isEnglish ? 'bg-ite-accent text-white shadow-lg shadow-ite-accent/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <BookOpen size={16} />
              مقرر هندسي (60)
            </button>
            <button 
              onClick={() => setIsEnglish(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${isEnglish ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Languages size={16} />
              لغة إنكليزية (50)
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex justify-between">
                  <span>علامة العملي ({config.pWeight * 100}%)</span>
                  {practical !== '' && <span className="text-ite-accent">{(pScore * config.pWeight).toFixed(1)} محصلة</span>}
                </label>
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={practical}
                  onChange={(e) => handleInput(e.target.value, setPractical)}
                  placeholder="مثلاً: 18"
                  className="w-full bg-ite-900 border-2 border-ite-700/50 rounded-2xl px-5 py-4 text-xl font-bold text-white placeholder-slate-700 focus:outline-none focus:border-ite-accent transition-all text-center"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex justify-between">
                  <span>علامة الامتحان ({config.eWeight * 100}%)</span>
                  {exam !== '' && <span className="text-ite-accent">{(eScore * config.eWeight).toFixed(1)} محصلة</span>}
                </label>
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={exam}
                  onChange={(e) => handleInput(e.target.value, setExam)}
                  placeholder="مثلاً: 45"
                  className="w-full bg-ite-900 border-2 border-ite-700/50 rounded-2xl px-5 py-4 text-xl font-bold text-white placeholder-slate-700 focus:outline-none focus:border-ite-accent transition-all text-center"
                />
              </div>
            </div>

            {suggestions && (
               <div className={`${isEnglish ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-ite-accent/10 border-ite-accent/30'} border-2 rounded-3xl p-5 animate-in zoom-in-95 duration-300`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} className={`${isEnglish ? 'text-indigo-400' : 'text-ite-accent'} animate-pulse`} />
                    <span className="text-sm font-black text-white">توقعات النجاح الذكية:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-ite-900/60 p-3 rounded-2xl border border-ite-700">
                      <span className="text-[10px] block text-slate-500 font-bold mb-1">للنجاح ({config.passScore})</span>
                      <span className={`text-lg font-black ${isEnglish ? 'text-indigo-400' : 'text-ite-accent'}`}>
                         تحتاج {suggestions.pass} <span className="text-xs text-slate-400 font-normal">في {suggestions.type === 'exam' ? 'النظري' : 'العملي'}</span>
                      </span>
                    </div>
                    <div className="bg-ite-900/60 p-3 rounded-2xl border border-ite-700">
                      <span className="text-[10px] block text-slate-500 font-bold mb-1">بالمساعدة ({config.helpThreshold})</span>
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
                {isEnglish 
                  ? "في اللغة الإنجليزية: النجاح من 50، العملي 20% والنظري 80%. تُجبر المحصلة لأقرب صحيح." 
                  : "في المقررات الهندسية: النجاح من 60، العملي 30% والنظري 70%. تُجبر المحصلة لأقرب صحيح."}
              </p>
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
                  style={{ width: `${Math.min(100, (finalScore / (isEnglish ? 50 : 60)) * 50)}%` }}
                ></div>
              </div>
            </div>

            <div className="h-4"></div>
          </div>
        </div>
        
        <div className="bg-ite-900/80 p-5 border-t border-ite-700 flex flex-col gap-4 px-8 pb-8 md:pb-5">
           <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
              <div className="flex items-center gap-2">
                <span>{(pScore * config.pWeight).toFixed(1)}</span>
                <span className="text-slate-700">+</span>
                <span>{(eScore * config.eWeight).toFixed(1)}</span>
                <Equal size={10} className="text-ite-accent mx-1"/> 
                <span className="text-slate-300">{weightedSum.toFixed(2)}</span>
              </div>
              <div className={`flex items-center gap-2 ${isEnglish ? 'text-indigo-400' : 'text-ite-accent'}`}>
                <ArrowRight size={12} />
                <span className="text-sm font-black">{finalScore}</span>
              </div>
           </div>

           <button 
             onClick={onClose}
             className="md:hidden w-full py-4 rounded-2xl bg-ite-800 text-slate-300 border border-ite-700 font-black text-sm active:scale-95 transition-all"
           >
             إغلاق الحاسبة
           </button>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;