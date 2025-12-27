import React, { useState, useMemo, useEffect } from 'react';
import { 
  Info, SquareCheck, Trash2, AlertTriangle, Heart, Lock, 
  AlertCircle, MessageCircle, Facebook, Send, X, ExternalLink 
} from 'lucide-react';
import { COURSES } from './data';
import { AcademicYear, CourseCategory, Course } from './types';

// Components
import Sidebar from './components/Sidebar';
import NavigationTabs from './components/NavigationTabs';
import CourseCard from './components/CourseCard';
import RoadmapView from './components/RoadmapView';
import GradeCalculator from './components/GradeCalculator';
import DailyTipModal from './components/DailyTipModal';

interface Toast {
  message: string;
  type: 'error' | 'warning' | 'info';
  visible: boolean;
}

const STORAGE_KEYS = {
  PASSED_COURSES: 'masar_ite_passed_courses',
  ACTIVE_TAB: 'masar_ite_active_tab'
};

const App: React.FC = () => {
  const [passedCourses, setPassedCourses] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PASSED_COURSES);
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        return new Set();
      }
    }
    return new Set();
  });

  const [activeTab, setActiveTab] = useState<CourseCategory | 'roadmap'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    return (saved as CourseCategory | 'roadmap') || 'general';
  });

  const [showTip, setShowTip] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [toast, setToast] = useState<Toast>({ message: '', type: 'info', visible: false });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PASSED_COURSES, JSON.stringify(Array.from(passedCourses)));
  }, [passedCourses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

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

  const showNotification = (message: string, type: 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type, visible: true });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const handleCourseInteraction = (course: Course, isLocked: boolean, lockReason?: string) => {
    if (isLocked) {
      showNotification(lockReason || 'هذه المادة مقفلة حالياً', 'warning');
      return;
    }

    setPassedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(course.id)) {
        newSet.delete(course.id);
      } else {
        newSet.add(course.id);
      }
      return newSet;
    });
  };

  const handleSelectAllInTab = () => {
    if (activeTab === 'roadmap') return;
    const coursesInTab = COURSES.filter(c => c.category === activeTab);
    
    setPassedCourses(prev => {
      const newSet = new Set(prev);
      let addedCount = 0;
      coursesInTab.forEach(c => {
        const prereqsMet = c.prerequisites ? c.prerequisites.every(pId => prev.has(pId)) : true;
        const creditsMet = c.minCreditsRequired ? totalCredits >= c.minCreditsRequired : true;
        
        if (prereqsMet && creditsMet) {
          if (!newSet.has(c.id)) {
            newSet.add(c.id);
            addedCount++;
          }
        }
      });

      if (addedCount > 0) {
        showNotification(`تمت إضافة ${addedCount} مادة متاحة بنجاح`, 'info');
      } else {
        showNotification('لم يتم إضافة مواد جديدة (تحقق من المتطلبات السابقة)', 'warning');
      }
      
      return newSet;
    });
  };

  const confirmReset = () => {
    setPassedCourses(new Set());
    localStorage.removeItem(STORAGE_KEYS.PASSED_COURSES);
    setShowResetConfirm(false);
    showNotification('تمت إعادة ضبط المسار الأكاديمي وتفريغ الذاكرة', 'info');
  };

  return (
    <div className="min-h-screen bg-ite-900 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-ite-accent/30 overflow-y-auto overflow-x-hidden">
      
      <Sidebar 
        totalCredits={totalCredits} 
        yearStatus={yearStatus} 
        onOpenCalculator={() => setShowCalculator(true)} 
      />

      <main className="flex-1 flex flex-col w-full min-w-0 bg-ite-900">
        <header className="hidden md:flex h-16 border-b border-ite-700 bg-ite-800/80 backdrop-blur-md items-center px-8 justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2 text-slate-300">
             <Info size={18} className="text-ite-accent" />
             <span className="text-sm font-medium">بياناتك تُحفظ تلقائياً في متصفحك الحالي.</span>
          </div>
        </header>

        <div className="flex flex-col w-full">
          <div className="sticky top-[72px] md:top-16 z-40 bg-ite-900 border-b border-ite-700/50 px-4 md:px-8 py-3 shadow-lg shadow-black/20">
            <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="p-4 md:p-8 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
               {activeTab !== 'roadmap' && (
                  <button 
                    onClick={handleSelectAllInTab}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 text-xs md:text-sm font-black rounded-2xl bg-ite-accent/10 text-ite-accent border border-ite-accent/30 active:scale-95 transition-all"
                  >
                    <SquareCheck size={18} />
                    <span>تحديد المتاح في القسم</span>
                  </button>
               )}
               <button 
                  onClick={() => setShowResetConfirm(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 text-xs md:text-sm font-black rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 active:scale-95 transition-all"
                >
                  <Trash2 size={18} />
                  <span>تصفير المسار</span>
                </button>
            </div>

            <section className="pb-10">
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
                    
                    let lockReason = '';
                    if (!prereqsMet) {
                      const pending = course.prerequisites?.filter(id => !passedCourses.has(id))
                        .map(id => COURSES.find(c => c.id === id)?.name)
                        .join(' و ');
                      lockReason = `يجب إنجاز: ${pending}`;
                    } else if (!creditsMet) {
                      lockReason = `تتطلب هذه المادة إنجاز ${course.minCreditsRequired} وحدة (لديك حالياً ${totalCredits})`;
                    }

                    return (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        isSelected={passedCourses.has(course.id)}
                        isLocked={isLocked}
                        creditsIssue={!creditsMet ? course.minCreditsRequired : undefined}
                        onToggle={() => handleCourseInteraction(course, isLocked, lockReason)}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            <footer className="mt-10 py-12 border-t border-ite-800/50 flex flex-col items-center justify-center gap-4">
               <div className="flex items-center gap-2 text-slate-500 text-xs font-bold opacity-80">
                 <span>صنع بكل</span>
                 <Heart size={14} className="text-rose-500 fill-rose-500/20" />
                 <span>لطلاب ITE</span>
                 <span className="w-1 h-1 bg-ite-700 rounded-full mx-1"></span>
                 <span>2025</span>
               </div>
               
               <div className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase flex items-center gap-2" dir="ltr">
                 Developed by 
                 <button 
                  onClick={() => setShowContact(true)}
                  className="text-ite-accent hover:text-white transition-all duration-300 px-3 py-1 bg-ite-accent/5 rounded-md border border-ite-accent/20 hover:border-ite-accent/50 active:scale-95 group relative overflow-hidden"
                 >
                   <span className="relative z-10 animate-neon-glow">&lt;SHTAYER/&gt;</span>
                   <span className="absolute inset-0 bg-ite-accent/10 blur-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></span>
                 </button>
               </div>
            </footer>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
           <div 
             className="absolute inset-0" 
             onClick={() => setShowContact(false)}
           ></div>
           
           <div className="bg-gradient-to-br from-ite-800 to-ite-900 border border-ite-700 rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              <button 
                onClick={() => setShowContact(false)}
                className="absolute top-5 left-5 p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="p-8 text-center">
                 <div className="w-20 h-20 bg-ite-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-ite-accent/20">
                    <MessageCircle size={40} className="text-ite-accent" />
                 </div>
                 
                 <h3 className="text-2xl font-black text-white mb-3">تواصل معنا</h3>
                 <p className="text-slate-400 text-sm mb-8 leading-relaxed px-2">
                    إذا كان لديك أي ملاحظات، اقتراحات، أو وجدت خطأ في الموقع، يسعدنا تواصلك معنا عبر إحدى المنصات التالية:
                 </p>

                 <div className="grid grid-cols-3 gap-4">
                    <a 
                      href="https://wa.me/963954403685" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 p-4 bg-ite-900/50 rounded-2xl border border-ite-700 hover:border-ite-accent/50 transition-all active:scale-90"
                    >
                       <MessageCircle size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-300 uppercase">WhatsApp</span>
                    </a>
                    <a 
                      href="https://www.facebook.com/share/17TXatekmd/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 p-4 bg-ite-900/50 rounded-2xl border border-ite-700 hover:border-ite-accent/50 transition-all active:scale-90"
                    >
                       <Facebook size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-300 uppercase">Facebook</span>
                    </a>
                    <a 
                      href="https://t.me/Shtayer99" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 p-4 bg-ite-900/50 rounded-2xl border border-ite-700 hover:border-ite-accent/50 transition-all active:scale-90"
                    >
                       <Send size={24} className="text-sky-400 group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-300 uppercase">Telegram</span>
                    </a>
                 </div>

                 <div className="mt-8 pt-6 border-t border-ite-700/50 text-[10px] text-slate-500 font-bold flex items-center justify-center gap-2 italic">
                    <ExternalLink size={12} />
                    بانتظار مساهمتكم في تطوير المنصة
                 </div>
              </div>
           </div>
        </div>
      )}

      {toast.visible && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[350] w-[calc(100%-2.5rem)] md:w-max max-w-lg animate-in slide-in-from-bottom-10 fade-in duration-400 ease-out pointer-events-none">
           <div className={`
             flex items-center justify-center gap-3 px-6 py-4 rounded-[2rem] border backdrop-blur-2xl shadow-2xl text-center
             ${toast.type === 'warning' ? 'bg-ite-800/95 border-warning/40 text-warning shadow-warning/20' : 
               toast.type === 'error' ? 'bg-ite-800/95 border-rose-500/40 text-rose-400 shadow-rose-500/20' : 
               'bg-ite-800/95 border-ite-accent/40 text-ite-accent shadow-ite-accent/20'}
           `}>
              <div className="flex-shrink-0">
                {toast.type === 'warning' ? <AlertCircle size={22} /> : <Info size={22} />}
              </div>
              <span className="text-sm font-black leading-snug">{toast.message}</span>
           </div>
        </div>
      )}

      {showTip && <DailyTipModal onClose={() => setShowTip(false)} />}
      {showCalculator && <GradeCalculator onClose={() => setShowCalculator(false)} />}

      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-ite-800 border-t md:border border-ite-700 rounded-t-[2.5rem] md:rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <AlertTriangle size={36} className="text-rose-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">تصفير المسار؟</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed px-4">
                ستفقد جميع اختياراتك للمواد المنجزة. هل أنت متأكد؟
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmReset}
                  className="w-full py-4 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all font-black shadow-lg shadow-rose-900/20"
                >
                  نعم، احذف التقدم
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-4 rounded-2xl bg-ite-900 text-slate-300 border border-ite-700 font-bold"
                >
                  تراجع
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