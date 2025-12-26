import React, { useMemo } from 'react';
import { BookOpen, Cpu, Code, BrainCircuit, Network, Award, Map as MapIcon, CircleCheck, Lock, ChevronRight } from 'lucide-react';
import { COURSES } from '../data';

interface RoadmapViewProps {
  passedCourses: Set<string>;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ passedCourses }) => {
  const sections = [
    {
      title: 'الكتلة العامة (Common Core)',
      icon: <BookOpen className="text-ite-accent" size={20} />,
      chains: [
        ['GCS301', 'GTW301', 'GOE301'],
        ['GEN301', 'GEN401', 'GEN501', 'GEN502', 'GEN601'],
        ['GMN401', 'GAC501'],
        ['GPM601', 'GET601']
      ]
    },
    {
      title: 'الجذع المشترك (برمجة ورياضيات)',
      icon: <Cpu className="text-rose-400" size={20} />,
      chains: [
        ['BMA401', 'BMA402', 'BNA401'],
        ['BMA401', 'BLA401', 'BNA401'],
        ['BPG401', 'BPG402', 'BPG601', 'BMP601'],
        ['BPG402', 'BOS501', 'NOS601'],
        ['BAS401', 'BLC401', 'BCA501', 'NCA601'],
        ['BPG402', 'BDA501', 'BDB501', 'SDB601'],
        ['BDA501', 'BCG601', 'BMM601'],
      ]
    },
    {
       title: 'هندسة البرمجيات (SE Track)',
       icon: <Code className="text-blue-400" size={20} />,
       chains: [
         ['BPG601', 'BSE601', 'SSE602', 'SSQ601'],
         ['BCM601', 'SCP601'],
         ['BDA501', 'SDE601', 'DDV601'],
         ['BWP501', 'SSW601', 'SIR601'],
       ]
    },
    {
      title: 'الذكاء الصنعي (AI Track)',
      icon: <BrainCircuit className="text-purple-400" size={20} />,
      chains: [
        ['BDA501', 'BAI501', 'AML601', 'MDL601'],
        ['BAI501', 'AES601', 'AVR601'],
        ['BAI501', 'AIP601', 'ACV601'],
        ['BAI501', 'ANN601', 'ANL601'],
      ]
    },
    {
      title: 'النظم والشبكات (SCN Track)',
      icon: <Network className="text-emerald-400" size={20} />,
      chains: [
        ['BNT501', 'NNT601', 'NNM601'],
        ['BNT501', 'BIS601', 'NSS601'],
        ['NOS601', 'NDS601'],
      ]
    },
    {
      title: 'مشاريع التخرج (Capstone)',
      icon: <Award className="text-yellow-400" size={20} />,
      chains: [
        ['BIS601', 'BPR601', 'BPR602']
      ]
    }
  ];

  const currentTotalCredits = useMemo(() => {
    return Array.from(passedCourses).reduce((sum: number, id) => {
       const c = COURSES.find(x => x.id === id);
       return sum + (c?.credits || 0);
    }, 0);
  }, [passedCourses]);

  return (
    <div className="space-y-6">
      <div className="bg-ite-800/30 p-4 md:p-6 rounded-3xl border border-ite-700">
        <h3 className="text-white font-bold mb-4 flex items-center gap-3 text-lg">
           <MapIcon size={24} className="text-ite-accent" />
           خريطة الأسبقيات
        </h3>
        
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-ite-900/40 p-4 md:p-6 rounded-3xl border border-ite-800 shadow-sm overflow-hidden">
              <h4 className="text-slate-200 font-bold mb-6 text-sm flex items-center gap-3">
                <div className="p-2 bg-ite-800 rounded-xl border border-ite-700">
                  {section.icon}
                </div>
                {section.title}
              </h4>
              
              <div className="flex flex-col gap-6 overflow-x-auto pb-4 no-scrollbar touch-pan-x -mx-4 px-4">
                 {section.chains.map((path, pIdx) => (
                    <div key={pIdx} className="flex items-center min-w-max p-2 rounded-2xl hover:bg-white/[0.02] transition-colors">
                      {path.map((courseId, cIdx) => {
                        const course = COURSES.find(c => c.id === courseId);
                        if (!course) return null;
                        
                        const isDone = passedCourses.has(courseId);
                        const prevMet = cIdx === 0 || passedCourses.has(path[cIdx - 1]);
                        const creditsMet = course.minCreditsRequired 
                          ? currentTotalCredits >= course.minCreditsRequired 
                          : true;

                        const isNext = !isDone && prevMet && creditsMet;
                        const isLocked = !prevMet || !creditsMet;

                        let connectorStatus: 'locked' | 'active' | 'completed' = 'locked';
                        if (cIdx > 0) {
                           const prevId = path[cIdx - 1];
                           const prevDone = passedCourses.has(prevId);
                           if (prevDone) {
                             if (isDone) connectorStatus = 'completed';
                             else connectorStatus = 'active';
                           }
                        }

                        return (
                          <React.Fragment key={courseId}>
                            {cIdx > 0 && (
                               <div className="flex items-center mx-1">
                                 <div className={`w-6 md:w-10 h-1 rounded-full transition-all duration-500 ${
                                    connectorStatus === 'completed' ? 'bg-ite-success shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                                    connectorStatus === 'active' ? 'bg-ite-accent animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.4)]' :
                                    'bg-ite-700/30'
                                 }`}></div>
                                 <ChevronRight 
                                    size={18} 
                                    strokeWidth={3}
                                    className={`-ml-2 z-10 ${
                                       connectorStatus === 'completed' ? 'text-ite-success' :
                                       connectorStatus === 'active' ? 'text-ite-accent' :
                                       'text-ite-700/30'
                                    }`}
                                 />
                               </div>
                            )}
                            
                            <div className={`
                              relative flex flex-col items-center justify-center
                              w-28 h-20 p-2 rounded-2xl border-2 transition-all duration-300
                              ${isDone 
                                ? 'bg-ite-success/10 border-ite-success text-ite-success' 
                                : isNext
                                  ? 'bg-ite-accent/10 border-ite-accent text-white scale-105 z-10 shadow-lg shadow-ite-accent/20'
                                  : 'bg-ite-800 border-ite-700 text-slate-600 opacity-60'
                              }
                            `}>
                              <span className="text-[9px] font-mono font-bold opacity-80 mb-0.5">{course.id}</span>
                              <span className="text-center font-bold text-[10px] leading-tight">
                                {course.name}
                              </span>
                              
                              {isDone && (
                                <div className="absolute -top-1.5 -right-1.5 bg-ite-900 rounded-full p-0.5 border border-ite-success shadow-lg">
                                  <CircleCheck size={14} className="text-ite-success fill-ite-success/20" />
                                </div>
                              )}
                              {isLocked && !isDone && (
                                <div className="absolute -top-1.5 -right-1.5 bg-ite-900 rounded-full p-0.5 border border-slate-700">
                                  <Lock size={12} className="text-slate-600" />
                                </div>
                              )}
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;