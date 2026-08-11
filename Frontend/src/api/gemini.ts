import { GoogleGenerativeAI } from '@google/generative-ai';

// مفتاح API المقدم من المستخدم
const API_KEY = 'AQ.Ab8RN6LOF1_4PfXygUlacKVjd-hTaCtO7L4IEb0JITw0cGzocA';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// نموذج الصور (Imagen)
const imageModel = genAI.getGenerativeModel({ model: 'imagen-3.0-fast-generate' });

export interface LessonParams {
  level: string;
  title: string;
  unit: string;
  duration: string;
  date: string;
  notes?: string;
  options: {
    createProblem: boolean;
    createActivities: boolean;
    createExperiment: boolean;
    createImages: boolean;
    createAssessment: boolean;
    createHomework: boolean;
    createRemediation: boolean;
  };
  schoolInfo: {
    wilaya: string;
    directorate: string;
    establishment: string;
    teacherName: string;
    academicYear: string;
  };
}

export interface LessonContent {
  sections: any[];
  raw: string;
}

/**
 * توليد المذكرة كاملة باستخدام Gemini
 */
export async function generateLesson(params: LessonParams): Promise<LessonContent> {
  const { level, title, unit, duration, notes, options, schoolInfo } = params;

  const levelMap: Record<string, string> = {
    'FIRST': 'السنة الأولى متوسط',
    'SECOND': 'السنة الثانية متوسط',
    'THIRD': 'السنة الثالثة متوسط',
    'FOURTH': 'السنة الرابعة متوسط',
  };

  const levelArabic = levelMap[level] || level;

  const prompt = `
أنت خبير بيداغوجي متخصص في تدريس مادة العلوم الفيزيائية والتكنولوجيا في الطور المتوسط بالجزائر.
المطلوب منك كتابة مذكرة بيداغوجية كاملة ومنظمة وفق المنهاج الجزائري الرسمي.

**المعلومات الأساسية:**
- المستوى: ${levelArabic}
- عنوان الدرس: ${title}
- الوحدة التعلمية: ${unit || 'غير محددة'}
- المدة الزمنية: ${duration} دقيقة
- السنة الدراسية: ${schoolInfo.academicYear}
- الملاحظات الإضافية: ${notes || 'لا توجد'}

**المطلوب توليد المذكرة بالهيكل التالي:**

---
الصفحة الأولى (الغلاف):
${schoolInfo.wilaya} | وزارة التربية الوطنية | مديرية التربية لولاية ${schoolInfo.wilaya}
المؤسسة التعليمية: ${schoolInfo.establishment}
الأستاذ: ${schoolInfo.teacherName}
المادة: العلوم الفيزيائية والتكنولوجيا
المستوى: ${levelArabic}
السنة الدراسية: ${schoolInfo.academicYear}
التاريخ: ${params.date}

---
المذكرة البيداغوجية:

**الكفاءة الختامية:**
[اكتب كفاءة ختامية مناسبة للدرس والمستوى]

**الكفاءات المستهدفة:**
- [كفاءة 1]
- [كفاءة 2]
- [كفاءة 3]

**المكتسبات القبلية:**
- [مكتسب 1]
- [مكتسب 2]

**الوسائل التعليمية:**
- [وسيلة 1]
- [وسيلة 2]
- [وسيلة 3]

**الوثائق المرجعية:**
- [مرجع 1]
- [مرجع 2]

**الصعوبات المحتملة:**
- [صعوبة 1]
- [صعوبة 2]

---
**الوضعية المشكلة:**
[اكتب وضعية واقعية مرتبطة بموضوع الدرس، تثير التساؤل وتدفع التلميذ للتفكير، مناسبة لعمر التلاميذ في ${levelArabic}]

**الأسئلة:**
1. [سؤال 1]
2. [سؤال 2]
3. [سؤال 3]

**الفرضيات المتوقعة:**
- [فرضية 1]
- [فرضية 2]

**توجيه الأستاذ:**
[كيف يوجه الأستاذ التلاميذ في هذه الوضعية]

**نشاط المتعلم:**
[ما هو النشاط المطلوب من التلميذ]

---
**النشاط 1: [عنوان النشاط]**
- الهدف: [هدف النشاط]
- الوسائل: [الأدوات والمواد]
- التعليمات: [تعليمات الإنجاز]
- الأسئلة:
  1. [سؤال]
  2. [سؤال]
- الإجابات/النتائج المتوقعة:
  1. [إجابة]
  2. [إجابة]
- الاستنتاج: [استنتاج النشاط]

---
**النشاط 2: [عنوان النشاط]**
[نفس الهيكل أعلاه]

---
**إرساء الموارد المعرفية:**
**المفهوم العلمي:** [تعريف المفهوم]
**الرمز:** [الرمز إن وجد]
**الوحدة:** [الوحدة]
**العلاقة الرياضية:** [العلاقة إن وجدت]
**شروط الاستعمال:** [الشروط]
**ملاحظات:** [ملاحظات مهمة]

**أمثلة تطبيقية:**
1. [مثال 1]
2. [مثال 2]

---
**النشاط التجريبي:**
- الهدف: [هدف التجربة]
- الأدوات: [الأدوات]
- المواد: [المواد]
- التركيب التجريبي: [وصف التركيب]
- خطوات الإنجاز:
  1. [خطوة]
  2. [خطوة]
- الملاحظات: [الملاحظات]
- النتائج: [النتائج]
- التفسير: [تفسير النتائج]
- الاستنتاج: [استنتاج التجربة]

---
**التقويم:**
1. [سؤال تقويم مباشر]
2. [سؤال فهم]
3. [تمرين حسابي]
4. [وضعية مشكلة صغيرة]
5. [سؤال استنتاج]

**الحل النموذجي:**
1. [حل]
2. [حل]
3. [حل]
4. [حل]
5. [حل]

---
**النشاط المنزلي:**
[تمرين أو نشاط منزلي]

---
**المعالجة البيداغوجية:**
**الأخطاء المتوقعة:**
- [خطأ 1]
- [خطأ 2]

**أسباب الأخطاء:**
- [سبب 1]
- [سبب 2]

**الفئات المستهدفة:**
- [فئة 1]

**نشاط علاجي:**
[نشاط لعلاج الأخطاء]

**تمرين إضافي:**
[تمرين إضافي]

**طريقة التصحيح:**
[كيفية التصحيح]
---

**تعليمات مهمة:**
1. استخدم المصطلحات العلمية الدقيقة المنهج الجزائري.
2. اجعل المحتوى مناسبًا لمستوى ${levelArabic}.
3. قدم أمثلة من الحياة اليومية الجزائرية.
4. تأكد من صحة القوانين والوحدات الفيزيائية.
5. لا تخترع معلومات علمية غير صحيحة.
6. اجعل النص منسقًا ومنظمًا.
7. اكتب كل شيء باللغة العربية الفصحى الواضحة.

${options.createProblem ? '' : 'لا تقم بتضمين قسم الوضعية المشكلة.'}
${options.createActivities ? '' : 'لا تقم بتضمين الأنشطة.'}
${options.createExperiment ? '' : 'لا تقم بتضمين النشاط التجريبي.'}
${options.createAssessment ? '' : 'لا تقم بتضمين التقويم.'}
${options.createHomework ? '' : 'لا تقم بتضمين النشاط المنزلي.'}
${options.createRemediation ? '' : 'لا تقم بتضمين المعالجة البيداغوجية.'}

قم بتوليد المذكرة كاملة بتنسيق HTML مع العناوين والفقرات المنظمة، مع الحفاظ على الهيكل المطلوب.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // تحويل النص إلى هيكل منظم
    const sections = parseLessonContent(text);

    return {
      sections,
      raw: text,
    };
  } catch (error) {
    console.error('Error generating lesson:', error);
    throw new Error('فشل في توليد المذكرة. يرجى المحاولة مرة أخرى.');
  }
}

/**
 * تحليل المحتوى النصي إلى أقسام منظمة
 */
function parseLessonContent(text: string): any[] {
  // تقسيم النص إلى أقسام بناءً على العناوين
  const sections: any[] = [];
  const lines = text.split('\n');
  let currentSection: any = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
      // عنوان رئيسي
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }
      currentSection = {
        type: 'section',
        title: line.trim().replace(/\*\*/g, '').trim(),
        content: '',
      };
      currentContent = [];
    } else if (line.trim().startsWith('---') || line.trim() === '') {
      // فاصل أو سطر فارغ
      continue;
    } else {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }

  return sections;
}

/**
 * توليد صورة تعليمية باستخدام Imagen
 */
export async function generateEducationalImage(prompt: string): Promise<string> {
  try {
    const fullPrompt = `
رسم تعليمي واضح وبسيط للعلوم الفيزيائية، مناسب لتلاميذ الطور المتوسط.
خلفية بيضاء، رسومات دقيقة علميًا، بدون عناصر زخرفية غير ضرورية.
${prompt}
`;
    const result = await imageModel.generateImages(fullPrompt);
    // استخراج الصورة بصيغة Base64
    const image = result.images[0];
    if (image) {
      return image.base64;
    }
    throw new Error('لم يتم توليد الصورة');
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('فشل في توليد الصورة');
  }
}

/**
 * تحسين النص باستخدام AI
 */
export async function improveText(text: string, instruction: string): Promise<string> {
  const prompt = `
النص التالي:
${text}

المطلوب: ${instruction}

قم بإرجاع النص المحسن فقط، دون أي شرح إضافي.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error improving text:', error);
    return text;
  }
}

/**
 * توليد تمرين إضافي
 */
export async function generateExercise(level: string, topic: string): Promise<string> {
  const prompt = `
أنشئ تمرينًا في مادة العلوم الفيزيائية والتكنولوجيا للمستوى: ${level}، حول موضوع: ${topic}.
يجب أن يكون التمرين مناسبًا للفئة العمرية، مع الحل النموذجي.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating exercise:', error);
    throw new Error('فشل في توليد التمرين');
  }
}

/**
 * فحص المذكرة والتحقق من جودتها
 */
export async function validateLesson(content: string, level: string, title: string): Promise<{
  score: number;
  valid: string[];
  warnings: string[];
  errors: string[];
}> {
  const prompt = `
قم بتحليل المذكرة التالية في مادة العلوم الفيزيائية والتكنولوجيا للمستوى: ${level}، عنوان الدرس: ${title}.

المذكرة:
${content}

قم بتقييمها وفق المعايير التالية:
1. المطابقة مع المستوى التعليمي
2. المطابقة مع الموضوع
3. الدقة العلمية (القوانين، الوحدات، المفاهيم)
4. مناسبة المصطلحات
5. مناسبة الأنشطة
6. صحة القوانين والوحدات
7. التناسق بين الأهداف والأنشطة والتقويم
8. وجود أخطاء علمية
9. وجود أقسام ناقصة

قم بإرجاع تقييمك بصيغة JSON كالتالي:
{
  "score": 85,
  "valid": ["العناصر الصحيحة 1", "العناصر الصحيحة 2"],
  "warnings": ["تحذير 1", "تحذير 2"],
  "errors": ["خطأ 1", "خطأ 2"]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // استخراج JSON من النص
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      score: 70,
      valid: ['التقييم التلقائي غير متاح'],
      warnings: ['يرجى مراجعة المذكرة يدويًا'],
      errors: [],
    };
  } catch (error) {
    console.error('Error validating lesson:', error);
    return {
      score: 50,
      valid: [],
      warnings: ['تعذر إجراء التقييم الآلي'],
      errors: ['يرجى مراجعة المذكرة يدويًا'],
    };
  }
}
