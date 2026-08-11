import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { improveText, validateLesson, generateEducationalImage } from '../api/gemini';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Save,
  FileDown,
  Image as ImageIcon,
  Wand2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Trash2,
} from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lessons, updateLesson, currentLesson, setCurrentLesson, schoolInfo } = useAppStore();
  const [lesson, setLesson] = useState<any>(null);
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [aiInstruction, setAiInstruction] = useState('');
  const [isImproving, setIsImproving] = useState(false);

  // تحميل المذكرة
  useEffect(() => {
    if (id) {
      const found = lessons.find((l) => l.id === id);
      if (found) {
        setLesson(found);
        setCurrentLesson(found);
        // استخراج النص من المحتوى
        if (found.content?.raw) {
          setContent(found.content.raw);
        } else if (found.content?.sections) {
          setContent(JSON.stringify(found.content.sections, null, 2));
        }
      } else {
        toast.error('المذكرة غير موجودة');
        navigate('/');
      }
    }
  }, [id, lessons]);

  // حفظ تلقائي
  useEffect(() => {
    if (lesson && content && isEditing) {
      const timer = setTimeout(() => {
        handleSave();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [content, lesson]);

  const handleSave = async () => {
    if (!lesson) return;
    setIsSaving(true);
    try {
      const updatedContent = {
        raw: content,
        sections: [],
      };
      updateLesson(lesson.id, { content: updatedContent });
      toast.success('تم الحفظ ✓');
    } catch (error) {
      toast.error('فشل الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!lesson) return;
    try {
      await exportToPDF(lesson, schoolInfo);
      toast.success('تم تصدير PDF بنجاح');
    } catch (error) {
      toast.error('فشل تصدير PDF');
    }
  };

  const handleValidate = async () => {
    if (!lesson) return;
    setIsValidating(true);
    try {
      const result = await validateLesson(content, lesson.level, lesson.title);
      setValidationResult(result);
      toast.success(`اكتمل الفحص: ${result.score}%`);
    } catch (error) {
      toast.error('فشل الفحص');
    } finally {
      setIsValidating(false);
    }
  };

  const handleImprove = async (instruction: string) => {
    if (!selectedText) {
      toast.warning('يرجى تحديد النص أولاً');
      return;
    }
    setIsImproving(true);
    try {
      const improved = await improveText(selectedText, instruction);
      // استبدال النص المحدد بالنص المحسن
      const newContent = content.replace(selectedText, improved);
      setContent(newContent);
      toast.success('تم تحسين النص');
      setSelectedText('');
    } catch (error) {
      toast.error('فشل التحسين');
    } finally {
      setIsImproving(false);
    }
  };

  const handleGenerateImage = async () => {
    const prompt = window.prompt('وصف الصورة المطلوبة:');
    if (!prompt) return;

    try {
      toast.loading('جاري توليد الصورة...');
      const imageBase64 = await generateEducationalImage(prompt);
      const imageHtml = `<img src="data:image/png;base64,${imageBase64}" style="max-width:100%; margin:10px 0;" alt="${prompt}" />`;
      setContent((prev) => prev + '\n\n' + imageHtml);
      toast.dismiss();
      toast.success('تم توليد الصورة وإضافتها');
    } catch (error) {
      toast.dismiss();
      toast.error('فشل توليد الصورة');
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toolbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
              <ArrowRight className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">{lesson.title}</h2>
            <span className="text-xs text-gray-400">v1</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                isEditing ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isEditing ? 'تعديل ✓' : 'عرض'}
            </button>

            <button
              onClick={handleGenerateImage}
              className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm flex items-center gap-1"
            >
              <ImageIcon className="w-4 h-4" />
              صورة
            </button>

            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm flex items-center gap-1"
            >
              {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              فحص
            </button>

            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1"
            >
              <FileDown className="w-4 h-4" />
              PDF
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setIsEditing(true);
                }}
                onMouseUp={() => {
                  const selection = window.getSelection();
                  if (selection) {
                    setSelectedText(selection.toString() || '');
                  }
                }}
                className="w-full min-h-[80vh] p-4 border border-gray-300 rounded-lg font-arabic text-base leading-relaxed"
                style={{ direction: 'rtl' }}
              />
            ) : (
              <div
                className="prose prose-lg max-w-none p-4 bg-white rounded-lg shadow-sm"
                style={{ direction: 'rtl' }}
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
              />
            )}
          </div>
        </div>

        {/* Side Panel - AI Assistant */}
        <aside className="w-80 bg-white border-r border-gray-100 p-4 overflow-auto hidden lg:block">
          <h3 className="font-bold text-gray-700 mb-4">مساعد الذكاء الاصطناعي</h3>

          <div className="space-y-4">
            {selectedText && (
              <div className="p-3 bg-primary-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">النص المحدد:</p>
                <p className="text-sm text-gray-700 line-clamp-3">{selectedText}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-600">تحسين النص</label>
              <select
                value={aiInstruction}
                onChange={(e) => setAiInstruction(e.target.value)}
                className="w-full input-field text-sm mt-1"
              >
                <option value="">اختر العملية...</option>
                <option value="تحسين الصياغة">تحسين الصياغة</option>
                <option value="تبسيط الشرح">تبسيط الشرح</option>
                <option value="زيادة التفصيل">زيادة التفصيل</option>
                <option value="اختصار">اختصار</option>
                <option value="تصحيح علمي">تصحيح علمي</option>
                <option value="إضافة مثال">إضافة مثال</option>
                <option value="إنشاء سؤال">إنشاء سؤال</option>
                <option value="إنشاء تمرين">إنشاء تمرين</option>
                <option value="إعادة صياغة مناسبة للسنة الدراسية">إعادة صياغة مناسبة للسنة الدراسية</option>
              </select>
              <button
                onClick={() => handleImprove(aiInstruction)}
                disabled={!selectedText || !aiInstruction || isImproving}
                className="w-full mt-2 btn-primary py-1.5 text-sm flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {isImproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                تطبيق
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={handleGenerateImage}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                توليد صورة تعليمية
              </button>
            </div>

            {validationResult && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">نتائج الفحص</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">التطابق:</span>
                  <span className="font-bold text-lg">{validationResult.score}%</span>
                </div>
                {validationResult.valid?.length > 0 && (
                  <div className="text-xs text-green-600 mb-1">
                    ✓ {validationResult.valid.join('، ')}
                  </div>
                )}
                {validationResult.warnings?.length > 0 && (
                  <div className="text-xs text-yellow-600 mb-1">
                    ⚠ {validationResult.warnings.join('، ')}
                  </div>
                )}
                {validationResult.errors?.length > 0 && (
                  <div className="text-xs text-red-600">
                    ✕ {validationResult.errors.join('، ')}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4 text-xs text-gray-400">
            <p>© 2026 Brahim Machet</p>
            <p>إعداد: المخبري إبراهيم معشت</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Editor;