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
  const unlockNames = course.unlocks?.map(id => {
    const unlockedCourse = COURSES.find(c => c.id === id);
    return unlockedCourse ? `${unlockedCourse.name} (${unlockedCourse.id})` : id;
  }).filter(Boolean);

  return (
    <div 
      onClick={!isLocked ? onToggle : undefined}
      className={`relative p-5 rounded-xl border transition-all duration-300 ease-out group flex flex-col justify-between h-full ${
        isLocked 
          ? 'bg-ite-900/50 border-ite-800 opacity-60 cursor-not-allowed grayscale-[0.5]' 
          : isSelected 
            ? 'bg-ite-accent/10 border-ite-accent shadow-lg shadow-ite-accent/10 cursor-pointer' 
            : 'bg-ite-800 border-ite-700 cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-ite-accent/20 hover:border-ite-accent'
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
            <span className={`text-xs font-mono font-medium mb-0.5 ${isSelected ? 'text-ite-accent/80' : 'text-slate-500'}`}>{course.id}</span>
            <h3 className={`font-bold text-base leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
              {course.name}
            </h3>
          </div>
          <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center transition-colors ${
            isSelected ? 'bg-ite-accent border-ite-accent' : 
            isLocked ? 'border-slate-700 bg-slate-800' : 'border-slate-500 bg-transparent'
          }`}>
            {isSelected && <CircleCheck size={14} className="text-white" />}
            {isLocked && <Lock size={12} className="text-slate-500" />}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-4">
          <span className={`px-2 py-1 rounded border ${isSelected ? 'border-ite-accent/30 bg-ite-accent/10 text-ite-accent' : 'border-slate-700 bg-slate-900'}`}>
            {course.credits} وحدة
          </span>
          {course.track && (
            <span className={`px-2 py-1 rounded border text-[10px] ${
              course.track === 'SE' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
              course.track === 'AI' ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' :
              'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            }`}>
               {course.track}
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto space-y-2">
        {isLocked && (
          <div className="flex flex-col gap-1 text-xs text-rose-400 bg-rose-900/10 p-2 rounded border border-rose-900/30">
             {prereqNames && prereqNames.length > 0 && (
               <div className="flex items-start gap-1.5">
                  <Lock size={12} className="mt-0.5 flex-shrink-0" />
                  <span>يتطلب: {prereqNames.join(' + ')}</span>
               </div>
             )}
             {creditsIssue && (
               <div className="flex items-start gap-1.5">
                  <Award size={12} className="mt-0.5 flex-shrink-0" />
                  <span>يحتاج إنجاز {creditsIssue} وحدة</span>
               </div>
             )}
          </div>
        )}

        {unlockNames && unlockNames.length > 0 && !isLocked && (
          <div className={`pt-3 border-t border-dashed ${isSelected ? 'border-ite-accent/20' : 'border-slate-700'}`}>
             <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-1.5">
                <ArrowRight size={12} className={isSelected ? 'text-ite-accent' : 'text-slate-500'} />
                <span className={`font-semibold ${isSelected ? 'text-ite-accent' : 'text-slate-500'}`}>
                   يفتح المقررات التالية:
                </span>
              </div>
              <p className={`pr-4 leading-relaxed ${isSelected ? 'text-ite-accent/80' : 'text-slate-400'}`}>
                 {unlockNames.join('، ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;