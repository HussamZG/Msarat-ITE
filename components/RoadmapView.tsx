import React, { useMemo, useState } from 'react';
import { Map as MapIcon, CircleCheck, Lock, MousePointer2, Info, ArrowLeft } from 'lucide-react';
import { COURSES } from '../data';
import { Course } from '../types';

interface RoadmapViewProps {
  passedCourses: Set<string>;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ passedCourses }) => {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

  // Calculate the rank (level) for each course based on prerequisites
  const { levels, connections } = useMemo(() => {
    const ranks: Record<string, number> = {};
    const adj: Record<string, string[]> = {};
    
    // Build adjacency list for "unlocks"
    COURSES.forEach(c => {
      if (c.prerequisites) {
        c.prerequisites.forEach(p => {
          if (!adj[p]) adj[p] = [];
          adj[p].push(c.id);
        });
      }
    });

    const getRank = (courseId: string, visited = new Set<string>()): number => {
      if (courseId in ranks) return ranks[courseId];
      if (visited.has(courseId)) return 0; 
      
      const newVisited = new Set(visited);
      newVisited.add(courseId);
      
      const course = COURSES.find(c => c.id === courseId);
      if (!course || !course.prerequisites || course.prerequisites.length === 0) {
        ranks[courseId] = 0;
        return 0;
      }

      const prRanks = course.prerequisites.map(p => getRank(p, newVisited));
      const maxRank = Math.max(...prRanks) + 1;
      ranks[courseId] = maxRank;
      return maxRank;
    };

    COURSES.forEach(c => getRank(c.id));
    
    const levelsArr: Course[][] = [];
    Object.entries(ranks).forEach(([id, rank]) => {
      const course = COURSES.find(c => c.id === id);
      if (course) {
        if (!levelsArr[rank]) levelsArr[rank] = [];
        levelsArr[rank].push(course);
      }
    });

    return { levels: levelsArr, connections: adj };
  }, []);

  const currentTotalCredits = useMemo(() => {
    return Array.from(passedCourses).reduce((sum: number, id) => {
      const c = COURSES.find(x => x.id === id);
      return sum + (c?.credits || 0);
    }, 0);
  }, [passedCourses]);

  const isCourseUnlocked = (course: Course) => {
    const prereqsMet = course.prerequisites 
      ? course.prerequisites.every(pId => passedCourses.has(pId))
      : true;
    const creditsMet = course.minCreditsRequired 
      ? currentTotalCredits >= course.minCreditsRequired 
      : true;
    return prereqsMet && creditsMet;
  };

  const getRelationType = (courseId: string) => {
    if (!hoveredCourse) return null;
    if (hoveredCourse === courseId) return 'active';
    
    const hoveredCourseData = COURSES.find(c => c.id === hoveredCourse);
    if (hoveredCourseData?.prerequisites?.includes(courseId)) return 'parent';
    
    if (connections[hoveredCourse]?.includes(courseId)) return 'child';
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-ite-800/30 p-4 md:p-8 rounded-[2.5rem] border border-ite-700 relative overflow-hidden min-h-[700px]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ite-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 relative z-10">
          <div>
            <h3 className="text-white font-black flex items-center gap-3 text-2xl">
               <MapIcon size={32} className="text-ite-accent" />
               خريطة الأسبقيات الذكية
            </h3>
            <p className="text-slate-400 text-sm mt-1">المواد مرتبة تلقائياً بناءً على "رتبة الأسبقية" الأكاديمية</p>
          </div>
          <div className="flex items-center gap-3 bg-ite-900/50 p-2 rounded-2xl border border-ite-700/50 backdrop-blur-sm">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 px-2">
               <div className="w-2.5 h-2.5 bg-ite-success rounded-full"></div> منجزة
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 px-2 border-r border-ite-700">
               <div className="w-2.5 h-2.5 bg-ite-accent rounded-full"></div> متاحة
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 px-2 border-r border-ite-700">
               <div className="w-2.5 h-2.5 bg-ite-800 border border-ite-700 rounded-full"></div> مقفولة
             </div>
          </div>
        </div>

        <div className="relative overflow-x-auto no-scrollbar pb-16 touch-pan-x touch-pan-y">
          <div className="flex gap-12 md:gap-20 min-w-max p-4 items-start">
            {levels.map((levelCourses, levelIdx) => (
              <div key={levelIdx} className="flex flex-col gap-8 relative">
                <div className="flex items-center gap-2 mb-2 px-2 sticky top-0 bg-transparent z-10">
                   <div className="h-4 w-1 bg-ite-accent/50 rounded-full"></div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                     المرحلة {levelIdx + 1}
                   </span>
                </div>
                
                {levelCourses.map((course) => {
                  const isDone = passedCourses.has(course.id);
                  const isAvailable = !isDone && isCourseUnlocked(course);
                  const isLocked = !isDone && !isAvailable;
                  const relation = getRelationType(course.id);

                  return (
                    <div 
                      key={course.id}
                      onMouseEnter={() => setHoveredCourse(course.id)}
                      onMouseLeave={() => setHoveredCourse(null)}
                      className={`
                        group relative flex flex-col items-center justify-center
                        w-44 h-28 md:w-52 md:h-32 p-4 rounded-[2.2rem] border-2 transition-all duration-500 cursor-help
                        ${isDone 
                          ? 'bg-ite-success/5 border-ite-success/40 text-ite-success shadow-lg shadow-ite-success/5' 
                          : isAvailable
                            ? 'bg-ite-accent/10 border-ite-accent text-white scale-105 z-20 shadow-2xl shadow-ite-accent/20 ring-4 ring-ite-accent/5'
                            : 'bg-ite-800/80 border-ite-700 text-slate-500 opacity-60'
                        }
                        ${relation === 'active' ? 'ring-2 ring-yellow-400 border-yellow-400 scale-110 z-30 shadow-yellow-400/20' : ''}
                        ${relation === 'parent' ? 'ring-2 ring-rose-500 border-rose-500 opacity-100 translate-x-2' : ''}
                        ${relation === 'child' ? 'ring-2 ring-emerald-400 border-emerald-400 opacity-100 -translate-x-2' : ''}
                        ${hoveredCourse && !relation ? 'opacity-10 blur-[2px]' : ''}
                      `}
                    >
                      {relation === 'parent' && (
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-rose-500 flex flex-col items-center animate-pulse">
                           <ArrowLeft size={24} />
                           <span className="text-[8px] font-black uppercase tracking-tighter">متطلب</span>
                        </div>
                      )}
                      {relation === 'child' && (
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-emerald-400 flex flex-col items-center animate-pulse rotate-180">
                           <ArrowLeft size={24} />
                           <span className="text-[8px] font-black uppercase tracking-tighter rotate-180">تفتح</span>
                        </div>
                      )}

                      <span className="text-[9px] font-mono font-black opacity-60 mb-1">{course.id}</span>
                      <h4 className="text-center font-black text-[11px] md:text-xs leading-tight line-clamp-2 px-1">
                        {course.name}
                      </h4>
                      
                      <div className="mt-2 flex flex-wrap justify-center gap-1">
                        {course.track && (
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                            course.track === 'SE' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                            course.track === 'AI' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}>
                            {course.track}
                          </span>
                        )}
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-ite-900/30 text-slate-500 border border-ite-700/50">
                          {course.credits}U
                        </span>
                      </div>

                      <div className={`absolute -top-2 -right-2 bg-ite-900 rounded-full p-1.5 border-2 shadow-lg z-30 transition-all duration-500 ${
                        isDone ? 'border-ite-success text-ite-success' : isLocked ? 'border-ite-700 text-slate-600' : 'border-ite-accent text-ite-accent scale-110'
                      }`}>
                        {isDone ? <CircleCheck size={14} /> : isLocked ? <Lock size={12} /> : <MousePointer2 size={12} className="animate-bounce" />}
                      </div>

                      <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bottom-full mb-4 left-1/2 -translate-x-1/2 w-64 bg-ite-800 border-2 border-ite-700 rounded-[2rem] p-5 shadow-2xl z-[100] transition-all duration-300 pointer-events-none">
                         <div className="flex items-center gap-3 mb-4 border-b border-ite-700/50 pb-3">
                            <div className="p-2 bg-ite-accent/20 rounded-xl">
                               <Info size={16} className="text-ite-accent" />
                            </div>
                            <div>
                               <div className="text-[10px] font-black text-white">{course.name}</div>
                               <div className="text-[9px] text-slate-500">تفاصيل المسار الأكاديمي</div>
                            </div>
                         </div>
                         <div className="space-y-3">
                            <div>
                               <div className="text-[9px] font-black text-slate-500 uppercase mb-1">المتطلبات السابقة:</div>
                               <div className="space-y-1">
                                {course.prerequisites?.map(pId => {
                                  const pCourse = COURSES.find(c => c.id === pId);
                                  return (
                                    <div key={pId} className="flex items-center justify-between gap-3 text-[9px] font-bold">
                                      <span className="text-slate-300 truncate max-w-[120px]">{pCourse?.name || pId}</span>
                                      <span className={`px-2 py-0.5 rounded-full ${passedCourses.has(pId) ? 'bg-ite-success/10 text-ite-success border border-ite-success/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                        {passedCourses.has(pId) ? 'منجزة ✓' : 'مطلوبة ✗'}
                                      </span>
                                    </div>
                                  );
                                }) || <div className="text-[9px] text-slate-600 italic">مادة أساسية لا تتطلب أسبقيات</div>}
                               </div>
                            </div>
                            
                            {connections[course.id] && (
                               <div>
                                 <div className="text-[9px] font-black text-slate-500 uppercase mb-1">تفتح هذه المواد:</div>
                                 <div className="flex flex-wrap gap-1">
                                    {connections[course.id].map(unlockId => (
                                      <span key={unlockId} className="px-2 py-0.5 bg-ite-900 border border-ite-700 rounded text-[9px] text-slate-400 font-mono">
                                        {unlockId}
                                      </span>
                                    ))}
                                 </div>
                               </div>
                            )}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row md:items-center gap-5 bg-ite-900/60 border border-ite-700/50 p-6 rounded-[2.5rem] backdrop-blur-md">
           <div className="p-4 bg-ite-accent/10 rounded-2xl border border-ite-accent/20">
              <Info size={28} className="text-ite-accent flex-shrink-0" />
           </div>
           <div>
             <h5 className="text-base font-black text-white mb-1">دليل الاستخدام الذكي</h5>
             <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
               تتبع هذه الخريطة تسلسلاً هندسياً دقيقاً. مرر الماوس فوق أي مادة لترى <strong>المسار العكسي</strong> (الأحمر) الذي يوضح ما كان يجب إنجازه، و **المسار المستقبلي** (الأخضر) الذي يوضح المواد التي ستتمكن من تسجيلها بعد إنجاز المادة الحالية.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;