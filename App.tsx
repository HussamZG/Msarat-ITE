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
    <div className="min-h-screen font-sans text-slate-100 flex flex-col md:flex-row overflow-hidden bg-ite-900">
      
      <Sidebar 
        totalCredits={totalCredits} 
        yearStatus={yearStatus} 
        onOpenCalculator={() => setShowCalculator(true)} 
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-ite-900 relative">
        <header className="h-16 border-b border-ite-700 bg-ite-800/80 backdrop-blur-md flex items-center px-4 md:px-8 justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-300">
             <Info size={18} className="text-ite-accent" />
             <span className="text-sm hidden md:inline">اختر المواد المنجزة لتفعيل المسارات (اللون الباهت يعني المادة مغلقة)</span>
             <span className="text-sm md:hidden">المسارات الأكاديمية</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          
          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex items-center justify-between gap-3 mb-6 px-1">
             {activeTab !== 'roadmap' && (
                <button 
                  onClick={handleSelectAllInTab}
                  className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium rounded-lg bg-ite-accent/10 text-ite-accent border border-ite-accent/30 hover:bg-ite-accent hover:text-white transition-all"
                >
                  <SquareCheck size={16} />
                  <span>تحديد كل مواد القسم</span>
                </button>
             )}
             <button 
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-all mr-auto bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white"
              >
                <Trash2 size={16} />
                <span>إلغاء تحديد الكل (إعادة ضبط)</span>
              </button>
          </div>

          {activeTab === 'roadmap' ? (
             <RoadmapView passedCourses={passedCourses} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
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
        </div>
      </main>

      {/* Modals & Popups */}
      
      {showTip && (
        <DailyTipModal onClose={() => setShowTip(false)} />
      )}

      {showCalculator && (
        <GradeCalculator onClose={() => setShowCalculator(false)} />
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-ite-800 border border-ite-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">هل أنت متأكد؟</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                سيتم حذف جميع المواد المحددة وإعادة التطبيق إلى حالته الأولية. لا يمكن التراجع عن هذا الإجراء.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-ite-900 text-slate-300 border border-ite-700 hover:bg-ite-700 transition-colors font-medium"
                >
                  إلغاء
                </button>
                <button 
                  onClick={confirmReset}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors font-medium shadow-lg shadow-rose-900/20"
                >
                  نعم، حذف الكل
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