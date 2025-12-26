import React, { useState, useMemo } from 'react';
import { Info, SquareCheck, Trash2, AlertTriangle } from 'lucide-react';
import { COURSES } from './data';
import { AcademicYear, CourseCategory } from './types';

// Components
import Sidebar from './components/Sidebar';
import NavigationTabs from './components/NavigationTabs';
import CourseCard from './components/CourseCard';
import RoadmapView from './components/RoadmapView';
import GradeCalculator from './components/GradeCalculator';
import DailyTipModal from './components/DailyTipModal';

const App: React.FC = () => {
  const [passedCourses, setPassedCourses] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<CourseCategory | 'roadmap'>('general');
  const [showTip, setShowTip] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalCredits = useMemo(() => {
    return Array.from(passedCourses).reduce((sum: number, id) => {
      const course = COURSES.find(c => c.id === id);
      return sum + (course?.credits || 0);
    }, 0);
  }, [passedCourses]);

  const yearStatus = useMemo(() => {
    if (totalCredits >= 220) return { name: AcademicYear.Fifth, progress: Math.min(1, (totalCredits - 220) / (300 - 220)) };
    if (totalCredits >= 160) return { name: AcademicYear.Fourth, progress: (totalCredits - 160) / (220 - 160) };
    if (totalCredits >= 100) return { name: AcademicYear.Third, progress: (totalCredits - 100) / (160 - 100) };
    if (totalCredits >= 40) return { name: AcademicYear.Second, progress: (totalCredits - 40) / (100 - 40) };
    return { name: AcademicYear.First, progress: totalCredits / 40 };
  }, [totalCredits]);

  const toggleCourse = (courseId: string) => {
    setPassedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handleSelectAllInTab = () => {
    if (activeTab === 'roadmap') return;
    setPassedCourses(prev => {
      const newSet = new Set(prev);
      const coursesInTab = COURSES.filter(c => c.category === activeTab);
      coursesInTab.forEach(c => newSet.add(c.id));
      return newSet;
    });
  };

  const confirmReset = () => {
    setPassedCourses(new Set());
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-ite-900 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-ite-accent/30 overflow-y-auto">
      
      {/* Sidebar handles its own stickiness and internal layout */}
      <Sidebar 
        totalCredits={totalCredits} 
        yearStatus={yearStatus} 
        onOpenCalculator={() => setShowCalculator(true)} 
      />

      {/* Main Content Area - No fixed height on mobile to allow natural page scroll */}
      <main className="flex-1 flex flex-col w-full overflow-x-hidden">
        {/* Desktop-only Header */}
        <header className="hidden md:flex h-16 border-b border-ite-700 bg-ite-800/80 backdrop-blur-md items-center px-8 justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 text-slate-300">
             <Info size={18} className="text-ite-accent" />
             <span className="text-sm">اختر المواد المنجزة لتفعيل المسارات (اللون الباهت يعني المادة مغلقة)</span>
          </div>
        </header>

        <div className="p-4 md:p-8 flex flex-col gap-6 w-full">
          
          {/* Navigation - Dynamic stickiness */}
          <div className="sticky top-[72px] md:top-16 z-30 -mx-4 px-4 bg-ite-900/95 backdrop-blur-xl md:bg-transparent md:backdrop-blur-none py-2 border-b border-ite-700/30 md:border-none">
            <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
             {activeTab !== 'roadmap' && (
                <button 
                  onClick={handleSelectAllInTab}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-xs md:text-sm font-bold rounded-2xl bg-ite-accent/10 text-ite-accent border border-ite-accent/30 active:scale-95 transition-all"
                >
                  <SquareCheck size={18} />
                  <span>تحديد هذا القسم</span>
                </button>
             )}
             <button 
                onClick={() => setShowResetConfirm(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-xs md:text-sm font-bold rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 active:scale-95 transition-all"
              >
                <Trash2 size={18} />
                <span>تصفير التقدم</span>
              </button>
          </div>

          <section className="pb-32">
            {activeTab === 'roadmap' ? (
              <RoadmapView passedCourses={passedCourses} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {COURSES.filter(c => c.category === activeTab).map(course => {
                  const prereqsMet = course.prerequisites 
                    ? course.prerequisites.every(pId => passedCourses.has(pId))
                    : true;
                  
                  const creditsMet = course.minCreditsRequired
                    ? totalCredits >= course.minCreditsRequired
                    : true;
                    
                  const isLocked = !prereqsMet || !creditsMet;

                  return (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isSelected={passedCourses.has(course.id)}
                      isLocked={isLocked}
                      creditsIssue={!creditsMet ? course.minCreditsRequired : undefined}
                      onToggle={() => toggleCourse(course.id)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      {showTip && <DailyTipModal onClose={() => setShowTip(false)} />}
      {showCalculator && <GradeCalculator onClose={() => setShowCalculator(false)} />}

      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-ite-800 border-t md:border border-ite-700 rounded-t-[2.5rem] md:rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">إعادة ضبط المسار؟</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                سيتم مسح جميع المواد المختارة والبدء من الصفر. هذا الإجراء لا يمكن التراجع عنه.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmReset}
                  className="w-full py-4 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] transition-all font-bold shadow-lg shadow-rose-900/20"
                >
                  نعم، حذف كل التقدم
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-4 rounded-2xl bg-ite-900 text-slate-300 border border-ite-700 font-bold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;