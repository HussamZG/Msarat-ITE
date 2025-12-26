import React, { useState, useMemo } from 'react';
import { Calculator, X, CircleAlert, CircleHelp, Equal, ArrowRight } from 'lucide-react';

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

  const requiredExam = useMemo(() => {
    if (practical !== '' && exam === '') {
      const target = 57.0001; 
      const neededFromExam = target - (pScore * 0.3);
      const req = Math.ceil(neededFromExam / 0.7);
      return Math.max(0, Math.min(100, req));
    }
    return null;
  }, [practical, exam, pScore]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-ite-800 border border-ite-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
            <Calculator className="text-ite-accent" />
            حاسبة المعدل الذكية
          </h2>
          <p className="text-slate-400 text-sm mb-6">درجة الأعمال (30%) + الامتحان (70%)</p>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex justify-between">
                <span>علامة الوظيفة (العملي)</span>
                <span className="text-slate-500 text-xs">الحد الأقصى 100</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={practical}
                  onChange={(e) => handleInput(e.target.value, setPractical)}
                  placeholder="0 - 100"
                  className="w-full bg-ite-900 border border-ite-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-ite-accent focus:ring-1 focus:ring-ite-accent transition-all dir-ltr text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex justify-between">
                <span>علامة الامتحان</span>
                <span className="text-slate-500 text-xs">الحد الأقصى 100</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={exam}
                  onChange={(e) => handleInput(e.target.value, setExam)}
                  placeholder="0 - 100"
                  className="w-full bg-ite-900 border border-ite-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-ite-accent focus:ring-1 focus:ring-ite-accent transition-all dir-ltr text-right"
                />
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-2">
              <CircleAlert size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed">
                ملاحظة: علامة النجاح هي 60. درجات المساعدة ترفع الـ 58 و 59 إلى 60 تلقائياً (بحد أقصى مادتين في الفصل).
              </p>
            </div>

            {requiredExam !== null && (
               <div className="bg-ite-accent/10 border border-ite-accent/20 rounded-xl p-3 flex items-start gap-3">
                 <CircleHelp className="text-ite-accent mt-0.5 flex-shrink-0" size={18} />
                 <div className="text-sm">
                   <span className="text-slate-300 block mb-1">توقع ذكي (مع المساعدة):</span>
                   <span className="text-white">
                     تحتاج <strong className="text-ite-accent">{requiredExam}</strong> في الامتحان لتصل للمحصلة 58 (ناجح بمساعدة).
                   </span>
                 </div>
               </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-dashed border-ite-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 font-medium">المحصلة النهائية</span>
              <div className="flex items-center gap-2">
                {isDirectPass ? (
                  <span className="text-xs bg-ite-success/10 text-ite-success px-2 py-1 rounded border border-ite-success/20">ناجح</span>
                ) : isHelpEligible ? (
                  <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">ناجح بمساعدة</span>
                ) : (
                  <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-1 rounded border border-rose-500/20">راسب</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-ite-900 rounded-full overflow-hidden border border-ite-700/50">
                <div 
                  className={`h-full transition-all duration-500 ${isPassing ? 'bg-ite-success' : 'bg-rose-500'}`} 
                  style={{ width: `${Math.min(100, finalScore)}%` }}
                ></div>
              </div>
              <div className={`text-4xl font-bold font-mono ${isPassing ? 'text-white' : 'text-rose-400'}`}>
                {finalScore}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-ite-900/50 p-4 border-t border-ite-700 flex justify-between text-xs text-slate-500">
           <span>العملي: {(pScore * 0.3).toFixed(1)}</span>
           <span>+</span>
           <span>النظري: {(eScore * 0.7).toFixed(1)}</span>
           <span className="flex items-center gap-1"><Equal size={12}/> {weightedSum.toFixed(1)}</span>
           <ArrowRight size={10} />
           <span>{finalScore}</span>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;