import React from 'react';
import { Network, X } from 'lucide-react';

interface WelcomeHeroProps {
  onClose: () => void;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onClose }) => {
  return (
    <div className="bg-gradient-to-r from-ite-800 to-ite-900 border border-ite-700 rounded-2xl p-6 mb-8 relative shadow-xl">
      <button 
        onClick={onClose}
        className="absolute top-4 left-4 p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={20} className="text-slate-400" />
      </button>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-ite-accent/20 rounded-xl hidden sm:block">
          <Network size={32} className="text-ite-accent" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">هندسة تقانة المعلومات (ITE)</h2>
          <p className="text-slate-300 mb-2 max-w-2xl text-sm md:text-base leading-relaxed">
            فرع هندسي رائد يدمج بين علوم الحاسوب وهندسة البرمجيات والشبكات والذكاء الصنعي. يهدف لتخريج مهندسين متميزين قادرين على بناء الحلول التقنية المتقدمة وقيادة التحول الرقمي في المؤسسات الحديثة.
          </p>
        </div>
      </div>
    </div>
  );
};
export default WelcomeHero;