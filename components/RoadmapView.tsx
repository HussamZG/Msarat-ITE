import React, { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { 
  CircleCheck, Lock, ArrowLeft, ZoomIn, ZoomOut, Maximize, 
  Target, Zap, Download, Share2, MousePointer, Filter, 
  Search, Eye, EyeOff, Sparkles, X, ExternalLink, Info
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { COURSES } from '../data';
import { Course, TrackType } from '../types';

interface RoadmapViewProps {
  passedCourses: Set<string>;
}

interface ConnectionLine {
  fromId: string;
  toId: string;
  path: string;
  active: boolean;
  passed: boolean;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ passedCourses }) => {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<TrackType | 'ALL'>('ALL');
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConnections, setShowConnections] = useState(true);
  
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const courseRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<ConnectionLine[]>([]);

  const selectedCourse = useMemo(() => 
    COURSES.find(c => c.id === selectedCourseId), 
  [selectedCourseId]);

  // Graph Structure Logic
  const { levels, connectionsMap } = useMemo(() => {
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
      const courseObj = COURSES.find(c => c.id === courseId);
      if (!courseObj || !courseObj.prerequisites || courseObj.prerequisites.length === 0) {
        ranks[courseId] = 0;
        return 0;
      }
      const prRanks = courseObj.prerequisites.map(p => getRank(p, newVisited));
      ranks[courseId] = Math.max(...prRanks) + 1;
      return ranks[courseId];
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

    return { levels: levelsArr, connectionsMap: adj };
  }, []);

  const updateLines = () => {
    if (!showConnections || !mapRef.current) return;
    const newLines: ConnectionLine[] = [];
    const mapRect = mapRef.current.getBoundingClientRect();

    COURSES.forEach(course => {
      if (!isVisibleInTrack(course)) return;
      course.prerequisites?.forEach(pId => {
        const fromEl = courseRefs.current[pId];
        const toEl = courseRefs.current[course.id];
        const pCourse = COURSES.find(c => c.id === pId);

        if (fromEl && toEl && pCourse && isVisibleInTrack(pCourse)) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          const startX = (fromRect.right - mapRect.left) / scale;
          const startY = (fromRect.top + fromRect.height / 2 - mapRect.top) / scale;
          const endX = (toRect.left - mapRect.left) / scale;
          const endY = (toRect.top + toRect.height / 2 - mapRect.top) / scale;
          const cp1x = startX + (endX - startX) * 0.5;
          const cp2x = startX + (endX - startX) * 0.5;
          const path = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
          const isActive = (hoveredCourse === course.id || hoveredCourse === pId || selectedCourseId === course.id || selectedCourseId === pId);
          newLines.push({ fromId: pId, toId: course.id, path, active: isActive, passed: passedCourses.has(pId) });
        }
      });
    });
    setLines(newLines);
  };

  useLayoutEffect(() => {
    updateLines();
  }, [levels, activeTrack, hoveredCourse, selectedCourseId, scale, showConnections, searchQuery]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleEnd = () => setIsDragging(false);
  
  const handleShareCourse = async (course: Course) => {
    const text = `مادة: ${course.name} (${course.credits} وحدة)
كود المادة: ${course.id}
المتطلبات: ${course.prerequisites?.map(p => COURSES.find(c => c.id === p)?.name).join('، ') || 'لا يوجد'}

تتبع مسارك الدراسي بدقة عبر منصة مسار ITE الذكية.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `مادة ${course.name} - مسار ITE`,
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(text);
      alert('تم نسخ تفاصيل المادة للحافظة!');
    }
  };

  const isVisibleInTrack = (course: Course) => {
    if (activeTrack === 'ALL') return true;
    return course.track === activeTrack || !course.track;
  };

  const isRelated = (courseId: string) => {
    const activeId = hoveredCourse || selectedCourseId;
    if (!activeId) return true;
    if (activeId === courseId) return true;
    const activeCourse = COURSES.find(c => c.id === activeId);
    if (activeCourse?.prerequisites?.includes(courseId)) return true;
    if (connectionsMap[activeId]?.includes(courseId)) return true;
    return false;
  };

  const exportAsImage = async () => {
    if (!mapRef.current) return;
    setIsExporting(true);
    await new Promise(r => setTimeout(r, 100));
    try {
      const dataUrl = await toPng(mapRef.current, {
        pixelRatio: 2,
        backgroundColor: '#0f172a',
        style: { transform: 'scale(1)', left: '0', top: '0', padding: '100px' }
      });
      const link = document.createElement('a');
      link.download = `ite-roadmap-${activeTrack}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { console.error(err); } finally { setIsExporting(false); }
  };

  return (
    <div className="relative flex flex-col gap-6 select-none">
      {/* Search & Tool Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-ite-800/80 p-4 rounded-[2rem] border border-ite-700/50 backdrop-blur-xl z-50">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-ite-accent/60" size={18} />
          <input 
            type="text"
            placeholder="بحث في الخريطة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ite-900/50 border border-ite-700 rounded-2xl py-3 pr-11 pl-4 text-sm text-white focus:outline-none focus:border-ite-accent transition-all placeholder:text-slate-600"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
               <X size={14} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['ALL', 'SE', 'AI', 'SCN'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTrack(t)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap border-2 ${
                activeTrack === t 
                ? 'bg-ite-accent border-ite-accent text-white shadow-xl shadow-ite-accent/20' 
                : 'bg-ite-900 border-ite-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              {t === 'ALL' ? 'كل المواد' : t}
            </button>
          ))}
          <div className="w-px h-8 bg-ite-700 mx-2"></div>
          <button 
            onClick={() => setShowConnections(!showConnections)}
            className={`p-2.5 rounded-xl border-2 transition-all ${showConnections ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-ite-900 border-ite-700 text-slate-500'}`}
          >
            {showConnections ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      <div className="relative group/map">
        {/* Float Controls */}
        <div className="absolute top-6 right-6 z-40 flex flex-col gap-3 pointer-events-none">
          <div className="bg-ite-800/95 backdrop-blur-md border border-ite-700/50 p-2 rounded-2xl flex flex-col gap-2 shadow-2xl pointer-events-auto">
            <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-3 hover:bg-ite-700 rounded-xl text-slate-300"><ZoomIn size={20}/></button>
            <button onClick={() => setScale(s => Math.max(0.3, s - 0.1))} className="p-3 hover:bg-ite-700 rounded-xl text-slate-300"><ZoomOut size={20}/></button>
            <div className="h-px bg-ite-700 mx-2"></div>
            <button onClick={() => { setScale(0.8); setPosition({x:0, y:0}); }} className="p-3 hover:bg-ite-700 rounded-xl text-ite-accent"><Maximize size={20}/></button>
          </div>
          <button onClick={exportAsImage} disabled={isExporting} className="pointer-events-auto bg-ite-accent hover:bg-blue-600 disabled:bg-slate-700 text-white p-4 rounded-2xl shadow-xl transition-all active:scale-90">
            {isExporting ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div> : <Download size={22} />}
          </button>
        </div>

        {/* Selected Course Overlay Panel */}
        {selectedCourse && (
          <div className="absolute left-6 top-6 bottom-6 w-full max-w-xs z-50 animate-in slide-in-from-right duration-500 pointer-events-none">
             <div className="h-full bg-ite-800/95 backdrop-blur-xl border border-ite-700 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col pointer-events-auto overflow-hidden">
                <div className="p-8 pb-4">
                   <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-ite-accent/10 rounded-2xl flex items-center justify-center border border-ite-accent/20">
                         <Info className="text-ite-accent" size={28} />
                      </div>
                      <button onClick={() => setSelectedCourseId(null)} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full">
                         <X size={20} />
                      </button>
                   </div>
                   <span className="text-xs font-mono font-black text-ite-accent tracking-widest uppercase mb-2 block">{selectedCourse.id}</span>
                   <h3 className="text-2xl font-black text-white leading-tight mb-4">{selectedCourse.name}</h3>
                   
                   <div className="flex gap-3 mb-8">
                      <div className="bg-ite-900 px-4 py-2 rounded-xl border border-ite-700">
                         <span className="text-[10px] text-slate-500 block font-bold">الوحدات</span>
                         <span className="text-sm text-white font-black">{selectedCourse.credits} وحدة</span>
                      </div>
                      {selectedCourse.track && (
                         <div className="bg-ite-accent/20 px-4 py-2 rounded-xl border border-ite-accent/30">
                            <span className="text-[10px] text-ite-accent block font-bold">المسار</span>
                            <span className="text-sm text-ite-accent font-black">{selectedCourse.track}</span>
                         </div>
                      )}
                   </div>

                   <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">المتطلبات السابقة</h4>
                        <div className="flex flex-wrap gap-2">
                           {selectedCourse.prerequisites?.length ? (
                             selectedCourse.prerequisites.map(pId => (
                               <div key={pId} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${passedCourses.has(pId) ? 'bg-ite-success/10 border-ite-success/30 text-ite-success' : 'bg-ite-900 border-ite-700 text-slate-400'}`}>
                                  {COURSES.find(c => c.id === pId)?.name}
                               </div>
                             ))
                           ) : (
                             <span className="text-[11px] text-slate-600 italic">لا يوجد متطلبات</span>
                           )}
                        </div>
                      </div>
                   </div>
                </div>
                
                <div className="mt-auto p-6 bg-ite-900/50 border-t border-ite-700/50 flex flex-col gap-3">
                   <button 
                     onClick={() => handleShareCourse(selectedCourse)}
                     className="w-full flex items-center justify-center gap-3 py-4 bg-ite-accent text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-ite-accent/20"
                   >
                      <Share2 size={18} />
                      مشاركة تفاصيل المادة
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Map Engine */}
        <div 
          ref={containerRef}
          className="relative h-[650px] md:h-[800px] w-full bg-ite-900 border-2 border-ite-700/50 rounded-[3.5rem] overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
        >
          {/* Background Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: `linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)`,
              backgroundSize: `${50 * scale}px ${50 * scale}px`,
              backgroundPosition: `${position.x}px ${position.y}px`
            }}
          ></div>

          <div ref={mapRef} className="absolute transition-transform duration-75 ease-out origin-center"
            style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, padding: '200px', minWidth: 'max-content' }}>
            {showConnections && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                {lines.map((line, idx) => (
                  <path key={`${line.fromId}-${line.toId}-${idx}`} d={line.path} fill="none"
                    stroke={line.active ? '#3b82f6' : line.passed ? '#10b981' : '#1e293b'}
                    strokeWidth={line.active ? 4 : 2} strokeDasharray={line.passed ? "0" : "5,5"}
                    className="transition-all duration-300" style={{ opacity: line.active ? 1 : 0.2 }} />
                ))}
              </svg>
            )}

            <div className="flex gap-48 items-start relative z-10">
              {levels.map((levelCourses, levelIdx) => (
                <div key={levelIdx} className="flex flex-col gap-20 relative pt-24">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="px-6 py-2 bg-ite-800 border-2 border-ite-700 rounded-full text-[10px] font-black text-slate-500 tracking-[0.3em] shadow-2xl backdrop-blur-md">LEVEL {levelIdx}</span>
                    <div className="w-0.5 h-16 bg-gradient-to-b from-ite-700 to-transparent"></div>
                  </div>
                  {levelCourses.map((course) => {
                    const isDone = passedCourses.has(course.id);
                    const isAvailable = !isDone && (!course.prerequisites || course.prerequisites.every(p => passedCourses.has(p)));
                    const isHighlighted = isRelated(course.id);
                    const isDimmed = (hoveredCourse || selectedCourseId) && !isHighlighted;
                    const matchesSearch = searchQuery === '' || course.name.includes(searchQuery) || course.id.includes(searchQuery);
                    if (!isVisibleInTrack(course)) return null;

                    return (
                      <div key={course.id} ref={el => { courseRefs.current[course.id] = el; }}
                        onMouseEnter={() => setHoveredCourse(course.id)} onMouseLeave={() => setHoveredCourse(null)}
                        onClick={(e) => { e.stopPropagation(); setSelectedCourseId(course.id === selectedCourseId ? null : course.id); }}
                        className={`group relative flex flex-col items-center justify-center w-56 h-40 p-8 rounded-[3rem] border-2 transition-all duration-500 cursor-pointer
                          ${isDone ? 'bg-ite-success/5 border-ite-success/30 text-ite-success' : isAvailable ? 'bg-ite-accent/10 border-ite-accent/40 text-white shadow-2xl shadow-ite-accent/10' : 'bg-ite-800/80 border-ite-700 text-slate-600 opacity-40'}
                          ${selectedCourseId === course.id ? 'ring-[12px] ring-ite-accent/20 border-ite-accent scale-110 z-40 animate-pulse' : ''}
                          ${isDimmed ? 'opacity-10 blur-[2px] grayscale scale-95' : 'opacity-100'}
                          ${!matchesSearch ? 'opacity-5 scale-75' : ''} hover:border-ite-accent hover:shadow-ite-accent/20 hover:scale-105 hover:z-30`}
                      >
                        {searchQuery && matchesSearch && <div className="absolute inset-0 rounded-[3rem] bg-ite-accent/10 blur-2xl animate-pulse"></div>}
                        <span className="text-[11px] font-mono font-black opacity-40 mb-2">{course.id}</span>
                        <h4 className="text-center font-black text-sm leading-tight text-slate-200 group-hover:text-white transition-colors">{course.name}</h4>
                        <div className="mt-5 flex items-center gap-3">
                          {course.track && <span className="text-[9px] px-2.5 py-1 bg-ite-accent/20 text-ite-accent rounded-lg font-black border border-ite-accent/30">{course.track}</span>}
                          <span className="text-[10px] font-black text-slate-500 bg-ite-900/50 px-2 py-1 rounded-md">{course.credits} UNIT</span>
                        </div>
                        <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-2xl border-4 border-ite-900 flex items-center justify-center shadow-2xl transition-all ${isDone ? 'bg-ite-success text-ite-900' : isAvailable ? 'bg-ite-accent text-white animate-bounce' : 'bg-ite-800 text-slate-700'}`}>
                          {isDone ? <CircleCheck size={24} /> : isAvailable ? <Sparkles size={24} /> : <Lock size={20} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;