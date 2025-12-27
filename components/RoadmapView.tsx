import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  Map as MapIcon, CircleCheck, Lock, MousePointer2, Info, 
  ArrowLeft, ZoomIn, ZoomOut, Maximize, Grip, BookOpen, 
  Target, Zap, Download, Share2, MousePointer
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { COURSES } from '../data';
import { Course } from '../types';

interface RoadmapViewProps {
  passedCourses: Set<string>;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ passedCourses }) => {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Viewport State
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Logic for graph levels
  const { levels, connections } = useMemo(() => {
    const ranks: Record<string, number> = {};
    const adj: Record<string, string[]> = {};
    
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
      // Fixed: Removed the incorrect line that was using an undefined 'id' variable.
      const courseObj = COURSES.find(c => c.id === courseId);
      if (!courseObj || !courseObj.prerequisites || courseObj.prerequisites.length === 0) {
        ranks[courseId] = 0;
        return 0;
      }
      const prRanks = courseObj.prerequisites.map(p => getRank(p, newVisited));
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

  // Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
  };

  const handleEnd = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.max(0.3, Math.min(2, prev + delta)));
    }
  };

  const resetViewport = () => {
    setScale(0.8);
    setPosition({ x: 0, y: 0 });
  };

  const exportAsImage = async () => {
    if (!mapRef.current) return;
    setIsExporting(true);
    
    await new Promise(r => setTimeout(r, 100));

    try {
      const dataUrl = await toPng(mapRef.current, {
        pixelRatio: 3,
        backgroundColor: '#0f172a',
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          left: '0',
          top: '0',
          margin: '40px'
        },
        filter: (node: any) => {
          if (node.tagName === 'IFRAME') return false;
          return true;
        }
      });
      
      const link = document.createElement('a');
      link.download = `ite-roadmap-${new Date().toLocaleDateString('ar-SY').replace(/\//g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
      alert('عذراً، حدث خطأ أثناء تصدير الصورة.');
    } finally {
      setIsExporting(false);
    }
  };

  const selectedCourse = useMemo(() => 
    COURSES.find(c => c.id === selectedCourseId), 
  [selectedCourseId]);

  const getRelationType = (courseId: string) => {
    const activeId = hoveredCourse || selectedCourseId;
    if (!activeId) return null;
    if (activeId === courseId) return 'active';
    const activeData = COURSES.find(c => c.id === activeId);
    if (activeData?.prerequisites?.includes(courseId)) return 'parent';
    if (connections[activeId]?.includes(courseId)) return 'child';
    return null;
  };

  const isCourseUnlocked = (course: Course) => {
    const prereqsMet = course.prerequisites 
      ? course.prerequisites.every(pId => passedCourses.has(pId))
      : true;
    return prereqsMet;
  };

  return (
    <div className="relative flex flex-col gap-4">
      <div className="absolute top-4 right-4 left-4 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <div className="bg-ite-800/90 backdrop-blur-md border border-ite-700 p-1.5 rounded-2xl flex flex-row md:flex-col gap-1 shadow-2xl">
            <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-3 hover:bg-ite-700 rounded-xl text-slate-300 transition-colors">
              <ZoomIn size={22} />
            </button>
            <button onClick={() => setScale(s => Math.max(0.3, s - 0.1))} className="p-3 hover:bg-ite-700 rounded-xl text-slate-300 transition-colors">
              <ZoomOut size={22} />
            </button>
            <div className="w-px h-6 bg-ite-700 mx-1 md:w-6 md:h-px md:mx-0 md:my-1"></div>
            <button onClick={resetViewport} className="p-3 hover:bg-ite-700 rounded-xl text-ite-accent transition-colors">
              <Maximize size={22} />
            </button>
          </div>
        </div>

        <button 
          onClick={exportAsImage}
          disabled={isExporting}
          className="pointer-events-auto bg-ite-accent hover:bg-blue-600 disabled:bg-slate-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-black text-sm shadow-xl shadow-ite-accent/20 transition-all active:scale-95"
        >
          {isExporting ? <span className="animate-spin text-lg">↻</span> : <Download size={20} />}
          <span className="hidden md:inline">تصدير كصورة</span>
        </button>
      </div>

      <div className="absolute top-20 left-4 z-40 bg-ite-900/80 border border-ite-700/50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400">
        الزوم: {Math.round(scale * 100)}%
      </div>

      <div 
        ref={containerRef}
        className={`
          relative h-[550px] md:h-[700px] w-full bg-ite-900 border border-ite-700 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden 
          cursor-grab active:cursor-grabbing select-none
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onWheel={handleWheel}
      >
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #334155 1px, transparent 1px)`,
            backgroundSize: `${40 * scale}px ${40 * scale}px`,
            backgroundPosition: `${position.x}px ${position.y}px`
          }}
        ></div>

        <div 
          ref={mapRef}
          className="absolute transition-transform duration-75 ease-out origin-center min-w-[2000px] min-h-[1000px]"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            top: '20%',
            left: '5%'
          }}
        >
          <div className="flex gap-28 items-start p-24">
            {levels.map((levelCourses, levelIdx) => (
              <div key={levelIdx} className="flex flex-col gap-14 relative">
                <div className="absolute -top-16 left-0 right-0 flex items-center justify-center">
                  <span className="px-5 py-1.5 bg-ite-800/80 border border-ite-700 rounded-full text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap shadow-xl">
                    المرحلة {levelIdx + 1}
                  </span>
                </div>
                
                {levelCourses.map((course) => {
                  const isDone = passedCourses.has(course.id);
                  const isAvailable = !isDone && isCourseUnlocked(course);
                  const isLocked = !isDone && !isAvailable;
                  const relation = getRelationType(course.id);
                  const isSelected = selectedCourseId === course.id;

                  return (
                    <div 
                      key={course.id}
                      onMouseEnter={() => setHoveredCourse(course.id)}
                      onMouseLeave={() => setHoveredCourse(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourseId(course.id);
                      }}
                      className={`
                        group relative flex flex-col items-center justify-center
                        w-48 h-32 p-6 rounded-[2.8rem] border-2 transition-all duration-300 cursor-pointer
                        ${isDone 
                          ? 'bg-ite-success/5 border-ite-success/40 text-ite-success' 
                          : isAvailable
                            ? 'bg-ite-accent/10 border-ite-accent/60 text-white shadow-xl shadow-ite-accent/10'
                            : 'bg-ite-800/80 border-ite-700 text-slate-500 opacity-60'
                        }
                        ${isSelected ? 'ring-4 ring-ite-accent border-ite-accent scale-110 z-30 shadow-2xl shadow-ite-accent/30' : ''}
                        ${relation === 'parent' ? 'border-rose-500 opacity-100 shadow-lg shadow-rose-500/20 translate-x-1' : ''}
                        ${relation === 'child' ? 'border-emerald-400 opacity-100 shadow-lg shadow-emerald-400/20 -translate-x-1' : ''}
                        ${(hoveredCourse || selectedCourseId) && !relation ? 'opacity-10 blur-[1px]' : ''}
                      `}
                    >
                      <span className="text-[10px] font-mono font-black opacity-60 mb-1">{course.id}</span>
                      <h4 className="text-center font-black text-xs leading-tight line-clamp-2 px-1">
                        {course.name}
                      </h4>
                      
                      <div className="mt-3 flex items-center gap-1.5">
                        {course.track && (
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            course.track === 'SE' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' :
                            course.track === 'AI' ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]' :
                            'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                          }`}></div>
                        )}
                        <span className="text-[10px] font-bold text-slate-500">{course.credits}U</span>
                      </div>

                      <div className={`absolute -top-3 -right-3 rounded-2xl p-2.5 border-2 shadow-2xl z-10 transition-all ${
                        isDone ? 'bg-ite-success border-ite-900 text-white' : 
                        isLocked ? 'bg-ite-800 border-ite-700 text-slate-600' : 
                        'bg-ite-accent border-ite-900 text-white scale-110'
                      }`}>
                        {isDone ? <CircleCheck size={16} /> : isLocked ? <Lock size={16} /> : <Zap size={16} className="animate-pulse" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCourse && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] md:hidden animate-in fade-in"
            onClick={() => setSelectedCourseId(null)}
          ></div>
          
          <div className={`
            fixed z-[200] bg-ite-900/98 backdrop-blur-2xl border-ite-700 shadow-2xl flex flex-col transition-all duration-300
            md:top-0 md:right-0 md:h-screen md:w-[420px] md:border-l md:animate-in md:slide-in-from-right
            bottom-0 left-0 right-0 max-h-[85vh] rounded-t-[3rem] border-t p-2 animate-in slide-in-from-bottom-4
          `}>
             <div className="w-16 h-1.5 bg-ite-700 rounded-full mx-auto my-4 md:hidden"></div>
             
             <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-start mb-6">
                  <button 
                    onClick={() => setSelectedCourseId(null)}
                    className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 flex items-center gap-2 text-sm font-bold transition-all"
                  >
                    <ArrowLeft size={18} className="rotate-180 md:rotate-0" />
                    <span className="hidden md:inline">إغلاق</span>
                  </button>
                  <div className="flex gap-2">
                     <button className="p-3 hover:bg-white/10 rounded-2xl text-slate-400"><Share2 size={20} /></button>
                  </div>
                </div>

                <div className="space-y-10">
                  <header>
                     <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-ite-accent/20 text-ite-accent text-[10px] font-black rounded-lg border border-ite-accent/30">{selectedCourse.id}</span>
                        {selectedCourse.track && <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedCourse.track}</span>}
                     </div>
                     <h2 className="text-3xl font-black text-white leading-tight mb-4">{selectedCourse.name}</h2>
                     <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[100px] bg-ite-800/50 p-4 rounded-3xl border border-ite-700/50">
                           <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">الوحدات</div>
                           <div className="text-2xl font-black text-white">{selectedCourse.credits}</div>
                        </div>
                        <div className="flex-1 min-w-[100px] bg-ite-800/50 p-4 rounded-3xl border border-ite-700/50">
                           <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">التصنيف</div>
                           <div className="text-lg font-black text-ite-accent">{selectedCourse.category}</div>
                        </div>
                     </div>
                  </header>

                  <section className="space-y-5">
                     <div className="flex items-center gap-3 text-slate-300 font-bold border-b border-ite-700 pb-3">
                        <Target size={20} className="text-rose-400" />
                        المتطلبات السابقة للمادة
                     </div>
                     <div className="grid gap-3">
                        {selectedCourse.prerequisites?.map(pId => {
                          const pCourse = COURSES.find(c => c.id === pId);
                          const isMet = passedCourses.has(pId);
                          return (
                            <div key={pId} className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${isMet ? 'bg-ite-success/10 border-ite-success/40' : 'bg-ite-900 border-ite-700'}`}>
                               <div className="flex flex-col">
                                  <span className="text-sm font-black text-white">{pCourse?.name}</span>
                                  <span className="text-[10px] font-mono text-slate-500 mt-1">{pId}</span>
                               </div>
                               <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isMet ? 'bg-ite-success text-ite-900' : 'bg-ite-800 text-slate-600'}`}>
                                  {isMet ? <CircleCheck size={18} /> : <Lock size={18} />}
                               </div>
                            </div>
                          );
                        }) || <div className="p-6 bg-ite-800/30 rounded-3xl border border-ite-700 border-dashed text-center text-sm text-slate-500 font-bold italic">هذه مادة تأسيسية (Level 0)</div>}
                     </div>
                  </section>

                  <section className="space-y-5">
                     <div className="flex items-center gap-3 text-slate-300 font-bold border-b border-ite-700 pb-3">
                        <Zap size={20} className="text-yellow-400" />
                        المواد التي تفتحها هذه المادة
                     </div>
                     <div className="flex flex-col gap-2">
                        {connections[selectedCourse.id]?.map(unlockId => {
                          const uCourse = COURSES.find(c => c.id === unlockId);
                          return (
                            <div key={unlockId} className="group p-4 bg-ite-800/50 hover:bg-ite-accent/10 rounded-2xl flex items-center gap-4 transition-all border border-ite-700/50 hover:border-ite-accent/50">
                               <div className="w-2 h-2 rounded-full bg-ite-accent group-hover:scale-150 transition-transform"></div>
                               <div className="flex flex-col">
                                 <span className="text-sm text-slate-300 font-bold group-hover:text-white transition-colors">{uCourse?.name}</span>
                                 <span className="text-[10px] text-slate-600 font-mono">{unlockId}</span>
                               </div>
                            </div>
                          );
                        }) || <div className="text-sm text-slate-600 italic px-4">لا توجد مواد لاحقة تعتمد عليها حالياً</div>}
                     </div>
                  </section>

                  {selectedCourse.skillTypes && (
                    <section className="space-y-5 pb-8">
                      <div className="flex items-center gap-3 text-slate-300 font-bold border-b border-ite-700 pb-3">
                          <BookOpen size={20} className="text-emerald-400" />
                          المهارات المكتسبة
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {selectedCourse.skillTypes.map(skill => (
                           <span key={skill} className="px-4 py-2 bg-ite-800 border border-ite-700 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-ite-700 transition-colors cursor-default">
                             {skill}
                           </span>
                         ))}
                      </div>
                    </section>
                  )}
                </div>
             </div>
             
             <div className="p-8 border-t border-ite-700 bg-ite-900/90 pb-12 md:pb-8">
                <div className={`flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all ${
                  isCourseUnlocked(selectedCourse) ? 'bg-ite-accent/10 border-ite-accent/50 shadow-lg shadow-ite-accent/10' : 'bg-rose-500/10 border-rose-500/50'
                }`}>
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${
                     isCourseUnlocked(selectedCourse) ? 'bg-ite-accent text-white' : 'bg-rose-500 text-white'
                   }`}>
                      {isCourseUnlocked(selectedCourse) ? <CircleCheck size={28} /> : <Lock size={28} />}
                   </div>
                   <div>
                      <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-0.5">حالة الأهلية</div>
                      <div className="text-base font-black text-white">
                         {isCourseUnlocked(selectedCourse) ? 'أنت جاهز لتسجيل المادة' : 'يتطلب إنجاز المتطلبات السابقة'}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-ite-800/30 border border-ite-700/50 p-8 rounded-[3rem] backdrop-blur-xl">
         <div className="lg:col-span-2">
           <h5 className="text-white font-black flex items-center gap-3 mb-6">
              <MousePointer size={20} className="text-ite-accent" />
              أدوات التفاعل
           </h5>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400 font-bold">
             <div className="flex items-center gap-4 p-4 bg-ite-900/50 rounded-2xl border border-ite-700/30">
               <div className="p-2 bg-ite-800 rounded-xl text-ite-accent"><Grip size={18} /></div>
               <span>اسحب بإصبع واحد أو بالماوس للتحرك بحرية</span>
             </div>
             <div className="flex items-center gap-4 p-4 bg-ite-900/50 rounded-2xl border border-ite-700/30">
               <div className="p-2 bg-ite-800 rounded-xl text-ite-accent"><ZoomIn size={18} /></div>
               <span>استخدم أزرار التحكم أو Ctrl + Scroll للتكبير</span>
             </div>
             <div className="flex items-center gap-4 p-4 bg-ite-900/50 rounded-2xl border border-ite-700/30">
               <div className="p-2 bg-ite-800 rounded-xl text-ite-accent"><Download size={18} /></div>
               <span>احفظ الخريطة كصورة عالية الجودة بضغطة زر</span>
             </div>
             <div className="flex items-center gap-4 p-4 bg-ite-900/50 rounded-2xl border border-ite-700/30">
               <div className="p-2 bg-ite-800 rounded-xl text-ite-accent"><Info size={18} /></div>
               <span>انقر على أي مادة لاستعراض مسارها الأكاديمي</span>
             </div>
           </div>
         </div>
         <div className="flex flex-col gap-6">
            <h5 className="text-white font-black mb-2">تخصصات الكلية</h5>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
                    <span className="text-[11px] font-black text-slate-300">هندسة البرمجيات SE</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono">Software Eng.</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-purple-500/5 border border-purple-500/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]"></div>
                    <span className="text-[11px] font-black text-slate-300">الذكاء الصنعي AI</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono">Artif. Intel.</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                    <span className="text-[11px] font-black text-slate-300">الشبكات والنظم SCN</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono">Networks</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RoadmapView;