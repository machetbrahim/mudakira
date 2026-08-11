import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, SchoolInfo } from '../store/useAppStore';
import toast from 'react-hot-toast';
import { ArrowRight, Save, User, Building, BookOpen, Calendar } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { schoolInfo, updateSchoolInfo, settings, updateSettings } = useAppStore();

  const [info, setInfo] = useState<SchoolInfo>(schoolInfo);
  const [autoSave, setAutoSave] = useState(settings.autoSave);
  const [defaultDuration, setDefaultDuration] = useState(settings.defaultDuration);

  const handleSave = () => {
    updateSchoolInfo(info);
    updateSettings({ autoSave, defaultDuration });
    toast.success('تم حفظ الإعدادات');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
            <ArrowRight className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        </div>

        <div className="space-y-6">
          {/* معلومات الأستاذ والمؤسسة */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              معلومات الأستاذ والمؤسسة
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">الولاية</label>
                  <input
                    type="text"
                    value={info.wilaya}
                    onChange={(e) => setInfo({ ...info, wilaya: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">مديرية التربية</label>
                  <input
                    type="text"
                    value={info.directorate}
                    onChange={(e) => setInfo({ ...info, directorate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="label-field">المؤسسة التعليمية</label>
                <input
                  type="text"
                  value={info.establishment}
                  onChange={(e) => setInfo({ ...info, establishment: e.target.value })}
                  className="input-field"
                  placeholder="متوسطة ..."
                />
              </div>

              <div>
                <label className="label-field">اسم الأستاذ</label>
                <input
                  type="text"
                  value={info.teacherName}
                  onChange={(e) => setInfo({ ...info, teacherName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">السنة الدراسية</label>
                <input
                  type="text"
                  value={info.academicYear}
                  onChange={(e) => setInfo({ ...info, academicYear: e.target.value })}
                  className="input-field"
                  placeholder="2025/2026"
                />
              </div>
            </div>
          </div>

          {/* إعدادات التطبيق */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              إعدادات التطبيق
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">الحفظ التلقائي</span>
              </label>

              <div>
                <label className="label-field">المدة الافتراضية للحصة (دقيقة)</label>
                <input
                  type="number"
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(Number(e.target.value))}
                  className="input-field w-32"
                  min="30"
                  max="120"
                />
              </div>
            </div>
          </div>

          {/* معلومات التطبيق */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">معلومات التطبيق</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>الإصدار:</strong> 1.0.0</p>
              <p><strong>المطور:</strong> المخبري إبراهيم معشت</p>
              <p><strong>الحقوق:</strong> © 2026 Brahim Machet — جميع الحقوق محفوظة</p>
              <p><strong>الترخيص:</strong> نسخة تجريبية</p>
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-lg">
            <Save className="w-5 h-5" />
            حفظ الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;