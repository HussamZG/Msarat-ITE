import { Course } from './types';

export const COURSES: Course[] = [
  // --- الكتلة العامة (General) ---
  { id: 'GCS301', name: 'مهارات حاسوب', credits: 4, category: 'general', unlocks: ['GTW301'] },
  { id: 'GTW301', name: 'مهارات التواصل والكتابة العلمية', credits: 5, category: 'general', prerequisites: ['GCS301'] },
  { id: 'GOE301', name: 'مدخل إلى التعلم الإلكتروني', credits: 4, category: 'general' },
  
  // سلسلة اللغة الإنكليزية (تعديل الوحدات بناءً على الجدول)
  { id: 'GEN301', name: 'اللغة الإنكليزية 1', credits: 4, category: 'general', unlocks: ['GEN401'] },
  { id: 'GEN401', name: 'اللغة الإنكليزية 2', credits: 4, category: 'general', prerequisites: ['GEN301'], unlocks: ['GEN501'] },
  { id: 'GEN501', name: 'اللغة الإنكليزية 3', credits: 5, category: 'general', prerequisites: ['GEN401'], unlocks: ['GEN502'] },
  { id: 'GEN502', name: 'اللغة الإنكليزية 4', credits: 5, category: 'general', prerequisites: ['GEN501'], unlocks: ['GEN601'] },
  { id: 'GEN601', name: 'اللغة الإنكليزية 5', credits: 5, category: 'general', prerequisites: ['GEN502'] },

  // الإدارة والمحاسبة
  { id: 'GMN401', name: 'أساسيات الإدارة', credits: 4, category: 'general', unlocks: ['GAC501'] },
  { id: 'GAC501', name: 'المحاسبة', credits: 5, category: 'general', prerequisites: ['GMN401'] },
  { id: 'GPM601', name: 'إدارة المشاريع المعلوماتية', credits: 6, category: 'general', unlocks: ['GET601'] },
  { id: 'GET601', name: 'أخلاقيات المهنة والمجتمع', credits: 6, category: 'general', prerequisites: ['GPM601'], unlocks: ['BIS601'] },
  { id: 'GEP601', name: 'نظرية المعرفة وعلوم الحاسب', credits: 4, category: 'general' },

  // --- الكتلة الأساسية (Basic) ---
  { id: 'BPH401', name: 'الفيزياء', credits: 5, category: 'basic', unlocks: ['BEC401'] },
  { id: 'BEC401', name: 'دارات إلكترونية', credits: 5, category: 'basic', prerequisites: ['BPH401'] },
  
  // الرياضيات
  { id: 'BMA401', name: 'تحليل 1', credits: 5, category: 'basic', unlocks: ['BMA402', 'BLA401'] },
  { id: 'BMA402', name: 'تحليل 2', credits: 5, category: 'basic', prerequisites: ['BMA401'], unlocks: ['BNA401'] },
  { id: 'BLA401', name: 'جبر خطي', credits: 5, category: 'basic', prerequisites: ['BMA401'], unlocks: ['BNA401'] },
  { id: 'BNA401', name: 'تحليل عددي', credits: 5, category: 'basic', prerequisites: ['BMA402', 'BLA401'] },
  { id: 'BDM501', name: 'الرياضيات المتقطعة', credits: 5, category: 'basic', prerequisites: ['BLC401'], unlocks: ['BPS601'] },
  { id: 'BPS601', name: 'الاحتمالات والإحصاء', credits: 6, category: 'basic', prerequisites: ['BDM501'], unlocks: ['BSM601'] },
  { id: 'BSP501', name: 'معالجة إشارة', credits: 5, category: 'basic' },
  { id: 'BSM601', name: 'النمذجة والمحاكاة والتحقق', credits: 5, category: 'basic', prerequisites: ['BPS601'] },

  // المنطق والبنيان
  { id: 'BAS401', name: 'بنى جبرية', credits: 5, category: 'basic', unlocks: ['BLC401'] },
  { id: 'BLC401', name: 'دارات منطقية', credits: 5, category: 'basic', prerequisites: ['BAS401'], unlocks: ['BCA501', 'BDM501'] },
  { id: 'BCA501', name: 'بنيان الحاسوب 1', credits: 6, category: 'basic', prerequisites: ['BLC401'], unlocks: ['BOS501'] },

  // --- الكتلة التخصصية (Specialized) ---
  { id: 'BPG401', name: 'برمجة 1', credits: 5, category: 'specialized', unlocks: ['BPG402'] },
  { id: 'BPG402', name: 'برمجة 2', credits: 5, category: 'specialized', prerequisites: ['BPG401'], unlocks: ['BWP401', 'BMP601', 'BOS501', 'BDA501', 'BPG601'] },
  
  // قواعد البيانات والمعطيات
  { id: 'BDA501', name: 'بنى المعطيات والخوارزميات', credits: 6, category: 'specialized', prerequisites: ['BPG402'], unlocks: ['BDB501', 'BDBL501', 'BAU501', 'BCG601', 'BAI501', 'BID601'] },
  { id: 'BDB501', name: 'نظم قواعد البيانات 1', credits: 4, category: 'specialized', prerequisites: ['BDA501'], unlocks: ['BIS601'] },
  { id: 'BDBL501', name: 'مخبر نظم قواعد البيانات 1', credits: 4, category: 'specialized', prerequisites: ['BDA501'] },
  
  // نظم التشغيل
  { id: 'BOS501', name: 'نظم التشغيل 1', credits: 4, category: 'specialized', prerequisites: ['BPG402', 'BCA501'], unlocks: ['BOSL501', 'BIS601'] },
  { id: 'BOSL501', name: 'مخبر نظم التشغيل 1', credits: 4, category: 'specialized', prerequisites: ['BOS501'] },

  // البرمجيات والويب
  { id: 'BWP401', name: 'برمجة الويب 1', credits: 5, category: 'specialized', prerequisites: ['BPG402'], unlocks: ['BWP501'] },
  { id: 'BWP501', name: 'برمجة الويب 2', credits: 5, category: 'specialized', prerequisites: ['BWP401'] },
  { id: 'BPG601', name: 'برمجة 3', credits: 5, category: 'specialized', prerequisites: ['BPG402'], unlocks: ['BSE601'] },
  { id: 'BSE601', name: 'هندسة البرمجيات 1', credits: 6, category: 'specialized', prerequisites: ['BPG601'], unlocks: ['BIS601'] },
  { id: 'BMP601', name: 'برمجة تطبيقات النقال', credits: 6, category: 'specialized', prerequisites: ['BPG402'] },

  // الشبكات والذكاء الصنعي
  { id: 'BTS501', name: 'نظم الاتصالات', credits: 5, category: 'basic', unlocks: ['BNT501'] },
  { id: 'BNT501', name: 'الشبكات الحاسوبية 1', credits: 6, category: 'specialized', prerequisites: ['BTS501'], unlocks: ['BIS601'] },
  { id: 'BAI501', name: 'الذكاء الصنعي', credits: 6, category: 'specialized', prerequisites: ['BDA501'], unlocks: ['BIA601'] },
  { id: 'BIA601', name: 'خوارزميات الذكاء الذكية', credits: 5, category: 'specialized', prerequisites: ['BAI501'] },

  // اللغات الصورية والمعلوماتية
  { id: 'BAU501', name: 'أوتومات ولغات صورية', credits: 5, category: 'basic', prerequisites: ['BDA501'], unlocks: ['BCM601'] },
  { id: 'BCM601', name: 'المترجمات', credits: 6, category: 'specialized', prerequisites: ['BAU501'] },
  { id: 'BCG601', name: 'البيانيات', credits: 6, category: 'specialized', prerequisites: ['BDA501'], unlocks: ['BMM601'] },
  { id: 'BMM601', name: 'نظم الوسائط المتعددة', credits: 6, category: 'specialized', prerequisites: ['BCG601'] },
  { id: 'BID601', name: 'تحليل وتصميم نظم المعلومات', credits: 6, category: 'specialized', prerequisites: ['BDA501'] },

  // --- كتلة المشاريع والأمن (Projects) ---
  { 
    id: 'BIS601', 
    name: 'أمن نظم المعلومات', 
    credits: 6, 
    category: 'specialized', 
    prerequisites: ['BOS501', 'BNT501', 'BDB501', 'BSE601', 'GET601'], 
    unlocks: ['BPR601'] 
  },
  { 
    id: 'BPR601', 
    name: 'مشروع 1', 
    credits: 6, 
    category: 'project', 
    prerequisites: ['BIS601'], 
    minCreditsRequired: 180, 
    unlocks: ['BPR602'] 
  },
  { 
    id: 'BPR602', 
    name: 'مشروع 2', 
    credits: 10, 
    category: 'project', 
    prerequisites: ['BPR601'], 
    minCreditsRequired: 240 
  },
];

export const TOTAL_GRADUATION_CREDITS = 300;
