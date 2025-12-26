import React from 'react';
import { CircleCheck, Lock, Award } from 'lucide-react';
import { Course } from '../types';
import { COURSES } from '../data';

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  isLocked: boolean;
  creditsIssue?: number;
  onToggle: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isSelected, isLocked, creditsIssue, onToggle }) => {
  const prereqNames = course.prerequisites?.map(id => COURSES.find(c => c.id === id)?.name).filter(Boolean);

  return (
    <div 
      onClick={!isLocked ? onToggle : undefined}
      className={`relative p-5 rounded-3xl border-2 transition-all duration-200 active:scale-[0.98] cursor-pointer select-none touch-manipulation ${
        isLocked 
          ? 'bg-ite-900/40 border-ite-800/50 opacity-60 cursor-not-allowed' 
          : isSelected 
            ? 'bg-ite-accent/10 border-ite-accent shadow-xl shadow-ite-accent/10' 
            : 'bg-ite-800/80 border-ite-700/50 hover:border-ite-accent/50 shadow-sm'
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col min-w-0">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-ite-accent' : 'text-slate-500'}`}>
              {course.id}
            </span>
            <h3 className={`font-bold text-sm md:text-base leading-snug break-words ${isSelected ? 'text-white' : 'text-slate-200'}`}>
              {course.name}
            </h3>
          </div>
          <div className={`w-7 h-7 flex-shrink-0 rounded-xl border-2 flex items-center justify-center transition-all ${
            isSelected ? 'bg-ite-accent border-ite-accent scale-110 shadow-lg shadow-ite-accent/40' : 
            isLocked ? 'border-ite-700 bg-ite-900' : 'border-slate-600 bg-ite-900/50'
          }`}>
            {isSelected && <CircleCheck size={18} className="text-white" />}
            {isLocked && <Lock size={14} className="text-slate-600" />}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${isSelected ? 'bg-ite-accent/20 border-ite-accent/30 text-ite-accent' : 'bg-ite-900/50 border-ite-700 text-slate-400'}`}>
            {course.credits} وحدة
          </span>
          {course.track && (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
              course.track === 'SE' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
              course.track === 'AI' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
              'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
               {course.track}
            </span>
          )}
        </div>

        {isLocked && (
          <div className="text-[10px] leading-relaxed text-rose-400 bg-rose-500/5 p-3 rounded-2xl border border-rose-500/10 mt-1">
             {prereqNames && prereqNames.length > 0 && (
               <div className="flex items-start gap-1.5 mb-1.5">
                  <Lock size={12} className="mt-0.5 flex-shrink-0" />
                  <span className="font-medium">يتطلب: {prereqNames.join(' + ')}</span>
               </div>
             )}
             {creditsIssue && (
               <div className="flex items-start gap-1.5">
                  <Award size={12} className="mt-0.5 flex-shrink-0" />
                  <span className="font-medium">يتطلب {creditsIssue} وحدة منجزة</span>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;