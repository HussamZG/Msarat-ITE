import { Course } from './types';

// Standardized Credits: General=4, Basic=5, Specialized=6, Projects=Var
export const COURSES: Course[] = [
  // --- 1. COMMON CORE - GENERAL (الكتلة العامة) ---
  { id: 'GCS301', name: 'مهارات الحاسوب', credits: 4, category: 'general', unlocks: ['GTW301'], skillTypes: ['professional'] },
  { id: 'GTW301', name: 'مهارات التواصل', credits: 4, category: 'general', prerequisites: ['GCS301'], skillTypes: ['general'] },
  { id: 'GOE301', name: 'مدخل إلى التعلم الإلكتروني', credits: 4, category: 'general', skillTypes: ['general'] },

  // English Chain - Updated credits to 3
  { id: 'GEN301', name: 'لغة إنكليزية (1)', credits: 3, category: 'general', unlocks: ['GEN401'], skillTypes: ['general'] },
  { id: 'GEN401', name: 'لغة إنكليزية (2)', credits: 3, category: 'general', prerequisites: ['GEN301'], unlocks: ['GEN501'], skillTypes: ['general'] },
  { id: 'GEN501', name: 'لغة إنكليزية (3)', credits: 3, category: 'general', prerequisites: ['GEN401'], unlocks: ['GEN502'], skillTypes: ['general'] },
  { id: 'GEN502', name: 'لغة إنكليزية (4)', credits: 3, category: 'general', prerequisites: ['GEN501'], unlocks: ['GEN601'], skillTypes: ['general'] },
  { id: 'GEN601', name: 'لغة إنكليزية (5)', credits: 3, category: 'general', prerequisites: ['GEN502'], skillTypes: ['general'] },

  // Management & Ethics
  { id: 'GMN401', name: 'أساسيات الإدارة', credits: 4, category: 'general', unlocks: ['GAC501'], skillTypes: ['general'] },
  { id: 'GAC501', name: 'المحاسبة', credits: 4, category: 'general', prerequisites: ['GMN401'], skillTypes: ['general'] },
  { id: 'GPM601', name: 'إدارة المشاريع', credits: 6, category: 'general', unlocks: ['GET601'], skillTypes: ['professional'] },
  { id: 'GET601', name: 'أخلاقيات المهنة', credits: 4, category: 'general', prerequisites: ['GPM601'], unlocks: ['BIS601'], skillTypes: ['general'] },
  { id: 'GEP601', name: 'نظرية المعرفة', credits: 4, category: 'general', skillTypes: ['intellectual'] },

  // --- 2. COMMON CORE - BASIC SCIENCES (الكتلة الأساسية) ---
  { id: 'BPH401', name: 'الفيزياء', credits: 5, category: 'basic', unlocks: ['BEC401'], skillTypes: ['intellectual'] },
  { id: 'BEC401', name: 'الدارات الإلكترونية', credits: 5, category: 'basic', prerequisites: ['BPH401'], skillTypes: ['intellectual'] },
  
  // Math Chain
  { id: 'BMA401', name: 'تحليل رياضي (1)', credits: 5, category: 'basic', unlocks: ['BMA402', 'BLA401'], skillTypes: ['intellectual'] },
  { id: 'BMA402', name: 'تحليل رياضي (2)', credits: 5, category: 'basic', prerequisites: ['BMA401'], unlocks: ['BNA401'], skillTypes: ['intellectual'] },
  { id: 'BLA401', name: 'الجبر الخطي', credits: 5, category: 'basic', prerequisites: ['BMA401'], unlocks: ['BNA401'], skillTypes: ['intellectual'] },
  { id: 'BNA401', name: 'تحليل عددي', credits: 5, category: 'basic', prerequisites: ['BMA402', 'BLA401'], skillTypes: ['intellectual'] },
  { id: 'BDM501', name: 'الرياضيات المتقطعة', credits: 5, category: 'basic', prerequisites: ['BLC401'], skillTypes: ['intellectual'] },
  { id: 'BPS601', name: 'الاحتمالات والإحصاء', credits: 5, category: 'basic', skillTypes: ['intellectual'] },
  { id: 'BSP501', name: 'معالجة إشارة', credits: 5, category: 'basic', skillTypes: ['intellectual'] },
  { id: 'BSM601', name: 'النمذجة والمحاكاة والتحقق', credits: 5, category: 'basic', skillTypes: ['intellectual'] },

  // Hardware Logic Chain
  { id: 'BAS401', name: 'بنى جبرية', credits: 5, category: 'basic', unlocks: ['BLC401'], skillTypes: ['intellectual'] },
  { id: 'BLC401', name: 'الدارات المنطقية', credits: 5, category: 'basic', prerequisites: ['BAS401'], unlocks: ['BCA501', 'BDM501'], skillTypes: ['intellectual'] },
  { id: 'BCA501', name: 'بنيان الحاسوب (1)', credits: 5, category: 'basic', prerequisites: ['BLC401'], unlocks: ['NCA601', 'BOS501'], skillTypes: ['intellectual'] },

  // Programming & Systems (Common)
  { id: 'BPG401', name: 'برمجة (1)', credits: 5, category: 'specialized', unlocks: ['BPG402'], skillTypes: ['professional'] },
  { id: 'BPG402', name: 'برمجة (2)', credits: 5, category: 'specialized', prerequisites: ['BPG401'], unlocks: ['BPG601', 'BDA501', 'BOS501', 'BWP401', 'BMP601'], skillTypes: ['professional'] },
  { id: 'BPG601', name: 'برمجة (3)', credits: 6, category: 'specialized', prerequisites: ['BPG402'], unlocks: ['BSE601'], skillTypes: ['professional'] },

  { id: 'BDA501', name: 'بنى المعطيات والخوارزميات', credits: 6, category: 'specialized', prerequisites: ['BPG402'], unlocks: ['BDB501', 'BAI501', 'BAU501', 'BCG601', 'SDA601', 'SDE601'], skillTypes: ['professional'] },
  { id: 'BDB501', name: 'نظم قواعد البيانات (1)', credits: 5, category: 'specialized', prerequisites: ['BDA501'], unlocks: ['SDB601', 'BIS601'], skillTypes: ['professional'] },
  
  { id: 'BOS501', name: 'نظم التشغيل (1)', credits: 5, category: 'specialized', prerequisites: ['BPG402', 'BCA501'], unlocks: ['NOS601', 'BIS601'], skillTypes: ['professional'] },

  { id: 'BWP401', name: 'برمجة الويب (1)', credits: 5, category: 'specialized', prerequisites: ['BPG402'], unlocks: ['BWP501'], skillTypes: ['professional'] },
  { id: 'BWP501', name: 'برمجة الويب (2)', credits: 5, category: 'specialized', prerequisites: ['BWP401'], unlocks: ['SSW601'], skillTypes: ['professional'] },
  { id: 'BMP601', name: 'برمجة تطبيقات النقال', credits: 6, category: 'specialized', prerequisites: ['BPG402'], skillTypes: ['professional'] },

  { id: 'BTS501', name: 'نظم الاتصالات', credits: 5, category: 'basic', unlocks: ['BNT501'], skillTypes: ['intellectual'] },
  { id: 'BNT501', name: 'الشبكات الحاسوبية (1)', credits: 5, category: 'specialized', prerequisites: ['BTS501'], unlocks: ['BIS601', 'NNT601'], skillTypes: ['professional'] },

  { id: 'BAU501', name: 'أوتومات ولغات صورية', credits: 5, category: 'basic', prerequisites: ['BDA501'], unlocks: ['BCM601'], skillTypes: ['intellectual'] },
  { id: 'BCM601', name: 'المترجمات', credits: 6, category: 'specialized', prerequisites: ['BAU501'], unlocks: ['SCP601'], skillTypes: ['intellectual'] },
  { id: 'BCG601', name: 'البيانيات', credits: 5, category: 'specialized', prerequisites: ['BDA501'], skillTypes: ['professional'] },
  
  // --- 4. TRACKS (SE, AI, SCN) ---

  // -> SE Track (Software Engineering)
  { id: 'BSE601', name: 'هندسة البرمجيات (1)', credits: 6, category: 'specialized', prerequisites: ['BPG601'], unlocks: ['SSE602', 'SSQ601'], skillTypes: ['professional'], track: 'SE' },
  { id: 'SSE602', name: 'هندسة البرمجيات (2)', credits: 6, category: 'specialized', prerequisites: ['BSE601'], skillTypes: ['professional'], track: 'SE' },
  { id: 'SDA601', name: 'بنى المعطيات (2)', credits: 6, category: 'specialized', prerequisites: ['BDA501'], skillTypes: ['professional'], track: 'SE' },
  { id: 'SDB601', name: 'نظم قواعد البيانات (2)', credits: 5, category: 'specialized', prerequisites: ['BDB501'], skillTypes: ['professional'], track: 'SE' },
  { id: 'SCP601', name: 'مشروع مترجمات', credits: 6, category: 'specialized', prerequisites: ['BCM601'], skillTypes: ['professional'], track: 'SE' },
  { id: 'SSW601', name: 'الويب الدلالي', credits: 6, category: 'specialized', prerequisites: ['BWP501'], skillTypes: ['intellectual'], track: 'SE' },
  { id: 'SDE601', name: 'تنقيب البيانات', credits: 6, category: 'specialized', prerequisites: ['BDA501'], skillTypes: ['intellectual'], track: 'SE' },
  { id: 'SSQ601', name: 'جودة البرمجيات', credits: 6, category: 'specialized', prerequisites: ['BSE601'], skillTypes: ['professional'], track: 'SE' },

  // -> AI Track (Artificial Intelligence)
  { id: 'BAI501', name: 'الذكاء الصنعي', credits: 6, category: 'specialized', prerequisites: ['BDA501'], unlocks: ['BIA601', 'ANN601', 'AML601', 'AES601', 'ACV601', 'ANL601'], skillTypes: ['intellectual'], track: 'AI' },
  { id: 'ANN601', name: 'الشبكات العصبونية', credits: 6, category: 'specialized', prerequisites: ['BAI501'], skillTypes: ['intellectual'], track: 'AI' },
  { id: 'AML601', name: 'تعلم الآلة', credits: 6, category: 'specialized', prerequisites: ['BAI501'], unlocks: ['MDL601'], skillTypes: ['intellectual'], track: 'AI' },
  { id: 'MDL601', name: 'التعلم العميق', credits: 6, category: 'specialized', prerequisites: ['AML601'], skillTypes: ['intellectual'], track: 'AI' },

  // -> SCN Track (Networks & Systems)
  { id: 'NOS601', name: 'نظم التشغيل (2)', credits: 5, category: 'specialized', prerequisites: ['BOS501'], unlocks: ['NDS601'], skillTypes: ['professional'], track: 'SCN' },
  { id: 'NCA601', name: 'بنيان الحاسوب (2)', credits: 6, category: 'specialized', prerequisites: ['BCA501'], skillTypes: ['intellectual'], track: 'SCN' },
  { id: 'NNT601', name: 'شبكات (2)', credits: 6, category: 'specialized', prerequisites: ['BNT501'], skillTypes: ['professional'], track: 'SCN' },
  { id: 'NSS601', name: 'أمن الشبكات', credits: 6, category: 'specialized', prerequisites: ['BIS601'], skillTypes: ['professional'], track: 'SCN' },
  { id: 'NDS601', name: 'النظم الموزعة والسحابية', credits: 6, category: 'specialized', prerequisites: ['NOS601'], skillTypes: ['professional'], track: 'SCN' },

  // --- 5. PROJECTS & CAPSTONE ---
  { 
    id: 'BIS601', 
    name: 'أمن نظم المعلومات', 
    credits: 6, 
    category: 'project', 
    prerequisites: ['BOS501', 'BDB501', 'BNT501', 'GET601'], 
    unlocks: ['BPR601', 'NSS601'], 
    skillTypes: ['professional'] 
  },
  { 
    id: 'BPR601', 
    name: 'مشروع (1)', 
    credits: 6, 
    category: 'project', 
    prerequisites: ['BIS601'], 
    minCreditsRequired: 180, 
    unlocks: ['BPR602'], 
    skillTypes: ['professional', 'general'] 
  },
  { 
    id: 'BPR602', 
    name: 'مشروع (2)', 
    credits: 10, 
    category: 'project', 
    prerequisites: ['BPR601'], 
    minCreditsRequired: 240, 
    skillTypes: ['professional', 'general'] 
  },
];

export const TOTAL_GRADUATION_CREDITS = 300;