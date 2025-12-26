import React, { useMemo } from 'react';
import { BookOpen, Cpu, Code, BrainCircuit, Network, Award, Map as MapIcon, ArrowRight, CircleCheck, Lock, ChevronRight } from 'lucide-react';
import { COURSES } from '../data';

interface RoadmapViewProps {
  passedCourses: Set<string>;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ passedCourses }) => {
  const sections = [
    {
      title: 'كتلة المقررات العامة (Common Core)',
      icon: <BookOpen className="text-ite-accent" size={20} />,
      chains: [
        ['GCS301', 'GTW301', 'GOE301'],
        ['GEN301', 'GEN401', 'GEN501', 'GEN502', 'GEN601'],
        ['GMN401', 'GAC501'],
        ['GPM601', 'GET601'] // Part of BIS chain
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
        ['BSM601', 'BID601']
      ]
    },
    {
       title: 'هندسة البرمجيات (SE Track)',
       icon: <Code className="text-blue-400" size={20} />,
       chains: [
         ['BPG601', 'BSE601', 'SSE602', 'SSQ601'],
         ['BCM601', 'SCP601'],
         ['BDA501', 'SDE601', 'DDV601'], // Data Science
         ['SDE601', 'DOB601', 'DSA601'], // Advanced Data
         ['SDE601', 'DPD601', 'DBD601'],
         ['BWP501', 'SSW601', 'SIR601'],
         ['DNL601']
       ]
    },
    {
      title: 'الذكاء الصنعي (AI Track)',
      icon: <BrainCircuit className="text-purple-400" size={20} />,
      chains: [
        ['BDA501', 'BAI501', 'AML601', 'MDL601'], // ML Sub-track
        ['BAI501', 'AES601', 'AVR601'], // Intelligent Systems
        ['BAI501', 'AIP601', 'ACV601'], // Vision
        ['BAI501', 'ANN601', 'ANL601'],
        ['BAI501', 'BIA601'],
        ['MBC601', 'MDA601']
      ]
    },
    {
      title: 'النظم والشبكات (SCN Track)',
      icon: <Network className="text-emerald-400" size={20} />,
      chains: [
        ['BNT501', 'NNT601', 'NNM601'], // Network Systems
        ['BNT501', 'BIS601', 'NSS601'], // Security
        ['NOS601', 'NDS601'],
        ['CSM601', 'CIR601'], // Cyber Security
        ['CCR601', 'CEH601', 'CSG601'] // Advanced Security
      ]
    },
    {
      title: 'مشاريع التخرج (Capstone)',
      icon: <Award className="text-yellow-400" size={20} />,
      chains: [
        ['BIS601', 'BPR601', 'BPR602'] // Security -> Project 1 -> Project 2
      ]
    }
  ];

  const currentTotalCredits = useMemo(() => {
    return Array.from(passedCourses).reduce((sum, id) => {
       const c = COURSES.find(x => x.id === id);
       return sum + (c?.credits || 0);
    }, 0);
  }, [passedCourses]);

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-ite-800/50 p-6 rounded-xl border border-ite-700">
        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
           <MapIcon size={24} className="text-ite-accent" />
           خريطة المقررات والأسبقيات (Detailed Course Map)
        </h3>
        
        <div className="grid grid-cols-1 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-ite-900/50 p-6 rounded-2xl border border-ite-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-slate-700/10 transition-colors"></div>

              <h4 className="text-slate-200 font-bold mb-8 text-base border-b border-ite-800 pb-4 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-ite-800 rounded-lg shadow-sm border border-ite-700">
                  {section.icon}
                </div>
                {section.title}
              </h4>
              
              <div className="flex flex-col gap-8 overflow-x-auto pb-4 relative z-10">
                 {section.chains.map((path, pIdx) => (
                    <div key={pIdx} className="flex items-center min-w-max p-4 group/chain hover:bg-white/[0.02] rounded-xl transition-colors">
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
                                 <div className={`w-8 md:w-12 h-1 rounded-full transition-all duration-500 ${
                                    connectorStatus === 'completed' ? 'bg-ite-success shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                                    connectorStatus === 'active' ? 'bg-ite-accent animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.4)]' :
                                    'bg-ite-700/30'
                                 }`}></div>
                                 <ChevronRight 
                                    size={20} 
                                    strokeWidth={3}
                                    className={`-ml-2.5 z-10 transition-all duration-500 ${
                                       connectorStatus === 'completed' ? 'text-ite-success drop-shadow-[0_0_2px_rgba(16,185,129,0.8)]' :
                                       connectorStatus === 'active' ? 'text-ite-accent drop-shadow-[0_0_2px_rgba(59,130,246,0.8)]' :
                                       'text-ite-700/30'
                                    }`}
                                 />
                               </div>
                            )}
                            
                            <div className={`
                              relative flex flex-col items-center justify-center
                              w-32 h-24 p-2 rounded-xl border-2 transition-all duration-300 z-10
                              ${isDone 
                                ? 'bg-ite-success/10 border-ite-success text-ite-success shadow-[0_4px_20px_rgba(16,185,129,0.15)] z-0' 
                                : isNext
                                  ? 'bg-ite-accent/10 border-ite-accent text-white shadow-[0_0_25px_rgba(59,130,246,0.3)] scale-110 z-10 ring-2 ring-ite-accent/20'
                                  : 'bg-ite-800 border-ite-700 text-slate-600 opacity-60 grayscale z-0'
                              }
                            `}>
                              <span className="text-[10px] font-mono opacity-80 mb-1">{course.id}</span>
                              <span className={`text-center font-bold text-xs leading-tight ${isDone || isNext ? 'opacity-100' : 'opacity-70'}`}>
                                {course.name}
                              </span>
                              {course.track && (
                                <span className={`text-[9px] mt-1.5 px-1.5 py-0.5 rounded ${isDone ? 'bg-ite-success/20' : 'bg-slate-700/50'}`}>
                                  {course.track}
                                </span>
                              )}
                              
                              {isDone && (
                                <div className="absolute -top-2 -right-2 bg-ite-900 rounded-full p-0.5 border border-ite-success">
                                  <CircleCheck size={14} className="text-ite-success fill-ite-success/20" />
                                </div>
                              )}
                              {isLocked && !isDone && (
                                <div className="absolute -top-2 -right-2 bg-ite-900 rounded-full p-0.5 border border-slate-700">
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