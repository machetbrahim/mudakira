import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { generateLesson, LessonContent } from '../api/gemini';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

const NewLesson: React.FC = () => {
  const navigate = useNavigate();
  const { schoolInfo, addLesson } = useAppStore();

  const [level, setLevel] = useState('FIRST');
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState('');
  const [duration, setDuration] = useState('60');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);

  const [options, setOptions] = useState({
    createProblem: true,
    createActivities: true,
    createExperiment: true,
    createImages: false,
    createAssessment: true,
    createHomework: true,
    createRemediation: true,
  });

  const levelOptions = [
    { value: 'FIRST', label: 'السنة الأولى متوسط' },
    { value: 'SECOND', label: 'السنة الثانية متوسط' },
    { value: 'THIRD', label: 'السنة الثالثة متوسط' },
    { value: 'FOURTH', label: 'السنة الرابعة متوسط' },
  ];

  const unitSuggestions: Record<string, string[]> = {
    FIRST: ['المادة وتحولاتها', 'الظواهر الكهربائية', 'الظواهر الميكانيكية'],
    SECOND: ['المادة وتحولاتها', 'الظواهر الكهربائية', 'الظواهر الميكانيكية', 'الضوء'],
    THIRD: ['المادة وتحولاتها', 'الظواهر الكهربائية', 'الظواهر الميكانيكية', 'الطاقة'],
    FOURTH: ['المادة وتحولاتها', 'الظواهر الكهربائية', 'الظواهر الميكانيكية', 'الطاقة', 'الكهرباء'],
  };

  const titleSuggestions: Record<string, string[]> = {
    FIRST: [
      'قياس الحجم',
      'تعيين الحجم',
      'قياس حجم جسم سائل',
      'كيف أقيس حجم سائل؟',
      'كيف تحسب حجم جسم صلب منتظم الشكل؟',
      'تعيين حجم جسم صلب ذي شكل كيفي',
      'قياس الكتلة ووحداتها',
      'الكتلة الحجمية والكثافة',
      'تعيين درجة الحرارة',
    ],
    SECOND: [
      'المادة وتحولاتها',
      'الكتلة الحجمية',
      'الكثافة',
      'التمدد الحراري',
      'الضغط',
      'الدائرة الكهربائية',
      'التيار الكهربائي',
    ],
    THIRD: [
      'الكتلة الحجمية والكثافة',
      'الضغط والسوائل',
      'التمدد الحراري للمواد',
      'الدائرة الكهربائية المتوالية',
      'الدائرة الكهربائية على التوازي',
      'الطاقة الكهربائية',
    ],
    FOURTH: [
      'الكتلة الحجمية والكثافة',
      'الضغط في السوائل والغازات',
      'التمدد الحراري',
      'الدائرة الكهربائية',
      'الطاقة الحركية',
      'الطاقة الكامنة',
      'تحولات الطاقة',
    ],
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان الدرس');
      return;
    }

    setIsGenerating(true);
    setProgress([]);

    try {
      setProgress((p) => [...p, 'تحليل الدرس...']);
      await new Promise((r) => setTimeout(r, 500));

      setProgress((p) => [...p, 'البحث في قاعدة المعرفة...']);
      await new Promise((r) => setTimeout(r, 500));

      setProgress((p) => [...p, 'بناء هيكل المذكرة...']);
      await new Promise((r) => setTimeout(r, 500));

      setProgress((p) => [...p, 'إنشاء الأنشطة...']);
      await new Promise((r) => setTimeout(r, 500));

      // توليد المحتوى الفعلي
      setProgress((p) => [...p, 'جاري توليد المحتوى... هذا قد يستغرق بعض الوقت']);
      await new Promise((r) => setTimeout(r, 300));

      const content = await generateLesson({
        level,
        title,
        unit,
        duration,
        date,
        notes,
        options,
        schoolInfo,
      });

      setProgress((p) => [...p, 'مراجعة المحتوى العلمي...']);
      await new Promise((r) => setTimeout(r, 500));

      setProgress((p) => [...p, 'إعداد الوثيقة...']);
      await new Promise((r) => setTimeout(r, 500));

      // حفظ المذكرة
      const lessonId = Date.now().toString();
      const newLesson = {
        id: lessonId,
        title,
        level,
        unit,
        duration,
        date,
        notes,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addLesson(newLesson);

      setProgress((p) => [...p, '✅ تم إنشاء المذكرة بنجاح!']);

      toast.success('تم إنشاء المذكرة بنجاح');
      setTimeout(() => {
        navigate(`/editor/${lessonId}`);
      }, 1000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'حدث خطأ أثناء التوليد');
      setProgress((p) => [...p, '❌ حدث خطأ، يرجى المحاولة مرة أخرى']);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
            <ArrowRight className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">إنشاء مذكرة جديدة</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card space-y-5">
              <div>
                <label className="label-field">المستوى *</label>
                <select
                  value={level}
                  onChange={(e) => {
                    setLevel(e.target.value);
                    setUnit('');
                  }}
                  className="input-field"
                >
                  {levelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-field">عنوان الدرس *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="مثال: قياس الحجم"
                  list="title-suggestions"
                />
                <datalist id="title-suggestions">
                  {(titleSuggestions[level] || []).map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
                <p className="text-xs text-gray-400 mt-1">يمكنك كتابة أي عنوان، وسيقوم الذكاء بتحليله</p>
              </div>

              <div>
                <label className="label-field">الوحدة التعلمية</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="input-field"
                  placeholder="مثال: المادة وتحولاتها"
                  list="unit-suggestions"
                />
                <datalist id="unit-suggestions">
                  {(unitSuggestions[level] || []).map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">المدة (دقيقة)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="input-field"
                    min="30"
                    max="120"
                  />
                </div>
                <div>
                  <label className="label-field">التاريخ</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="label-field">ملاحظات إضافية</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field min-h-[80px]"
                  placeholder="أي ملاحظات أو متطلبات خاصة..."
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-700 mb-3">خيارات التوليد</p>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={options.createProblem}
                      onChange={(e) =>
                        setOptions({ ...options, createProblem: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    وضعية مشكلة
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={options.createActivities}
                      onChange={(e) =>
                        setOptions({ ...options, createActivities: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    أنشطة
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={options.createExperiment}
                      onChange={(e) =>
                        setOptions({ ...options, createExperiment: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    تجربة
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={options.createImages}
                      onChange={(e) =>
                        setOptions({ ...options, createImages: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    صور (AI)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={options.createAssessment}
                      onChange={(e) =>
                        setOptions({ ...options, createAssessment: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    تقويم
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={options.createHomework}
                      onChange={(e) =>
                        setOptions({ ...options, createHomework: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    واجب منزلي
                  </label>
                  <label className="flex items-center gap-2 text-sm col-span-2">
                    <input
                      type="checkbox"
                      checked={options.createRemediation}
                      onChange={(e) =>
                        setOptions({ ...options, createRemediation: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    معالجة بيداغوجية
                  </label>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !title.trim()}
                className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    توليد المذكرة بالذكاء الاصطناعي
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Side */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-4">مراحل التوليد</h3>
              {progress.length === 0 ? (
                <p className="text-gray-400 text-sm">سيتم عرض مراحل التوليد هنا...</p>
              ) : (
                <div className="space-y-2">
                  {progress.map((step, index) => {
                    const isComplete = step.includes('✅');
                    const isError = step.includes('❌');
                    const isPending = !isComplete && !isError && index === progress.length - 1 && isGenerating;

                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-2 text-sm p-2 rounded-lg ${
                          isComplete
                            ? 'text-green-700 bg-green-50'
                            : isError
                            ? 'text-red-700 bg-red-50'
                            : isPending
                            ? 'text-primary-700 bg-primary-50'
                            : 'text-gray-500'
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : isError ? (
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : isPending ? (
                          <Loader2 className="w-4 h-4 mt-0.5 animate-spin flex-shrink-0" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mt-0.5 text-gray-300 flex-shrink-0" />
                        )}
                        <span>{step}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLesson;