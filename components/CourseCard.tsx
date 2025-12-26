import React from 'react';
import { CircleCheck, Lock, Award, ArrowRight } from 'lucide-react';
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
      className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] touch-none select-none ${
        isLocked 
          ? 'bg-ite-900/40 border-ite-800/50 opacity-50 cursor-not-allowed' 
          : isSelected 
            ? 'bg-ite-accent/10 border-ite-accent shadow-lg shadow-ite-accent/10' 
            : 'bg-ite-800/80 border-ite-700/50 cursor-pointer hover:border-ite-accent/50'
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col min-w-0">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5 ${isSelected ? 'text-ite-accent' : 'text-slate-500'}`}>
              {course.id}
            </span>
            <h3 className={`font-bold text-sm md:text-base leading-tight truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
              {course.name}
            </h3>
          </div>
          <div className={`w-6 h-6 flex-shrink-0 rounded-lg border-2 flex items-center justify-center transition-all ${
            isSelected ? 'bg-ite-accent border-ite-accent scale-110 shadow-lg shadow-ite-accent/40' : 
            isLocked ? 'border-ite-700 bg-ite-900' : 'border-slate-600 bg-ite-900/50'
          }`}>
            {isSelected && <CircleCheck size={16} className="text-white" />}
            {isLocked && <Lock size={12} className="text-slate-600" />}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isSelected ? 'bg-ite-accent/20 border-ite-accent/30 text-ite-accent' : 'bg-ite-900/50 border-ite-700 text-slate-400'}`}>
            {course.credits} وحدة
          </span>
          {course.track && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              course.track === 'SE' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
              course.track === 'AI' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
              'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
               {course.track}
            </span>
          )}
        </div>

        {isLocked && (
          <div className="text-[10px] leading-relaxed text-rose-400 bg-rose-500/5 p-2 rounded-xl border border-rose-500/10">
             {prereqNames && prereqNames.length > 0 && (
               <div className="flex items-start gap-1.5 mb-1">
                  <Lock size={10} className="mt-0.5" />
                  <span>يتطلب: {prereqNames.join(' + ')}</span>
               </div>
             )}
             {creditsIssue && (
               <div className="flex items-start gap-1.5">
                  <Award size={10} className="mt-0.5" />
                  <span>يتطلب {creditsIssue} وحدة منجزة</span>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;