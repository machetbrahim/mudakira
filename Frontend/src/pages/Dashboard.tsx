import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  Plus,
  FileText,
  Settings,
  LogOut,
  Search,
  Trash2,
  Edit,
  Copy,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { lessons, user, logout, deleteLesson, setCurrentLesson } = useAppStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title.includes(search) || lesson.unit.includes(search);
    const matchesLevel = filterLevel === 'all' || lesson.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المذكرة؟')) {
      deleteLesson(id);
      toast.success('تم حذف المذكرة');
    }
  };

  const handleEdit = (lesson: any) => {
    setCurrentLesson(lesson);
    navigate(`/editor/${lesson.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const levelOptions = [
    { value: 'all', label: 'جميع المستويات' },
    { value: 'FIRST', label: 'السنة الأولى متوسط' },
    { value: 'SECOND', label: 'السنة الثانية متوسط' },
    { value: 'THIRD', label: 'السنة الثالثة متوسط' },
    { value: 'FOURTH', label: 'السنة الرابعة متوسط' },
  ];

  const levelLabels: Record<string, string> = {
    FIRST: 'الأولى متوسط',
    SECOND: 'الثانية متوسط',
    THIRD: 'الثالثة متوسط',
    FOURTH: 'الرابعة متوسط',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-l border-gray-100 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-600">مذكرتي في العلوم</h1>
          <p className="text-xs text-gray-500">الذكاء الاصطناعي للأساتذة</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg"
          >
            <FileText className="w-5 h-5" />
            <span>مذكراتي</span>
          </button>
          <button
            onClick={() => navigate('/new')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            <span>إنشاء مذكرة جديدة</span>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition"
          >
            <Settings className="w-5 h-5" />
            <span>الإعدادات</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              {user?.name?.charAt(0) || 'م'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.name || 'مستخدم'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mr-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مذكراتي</h1>
            <p className="text-gray-500">جميع المذكرات التي قمت بإنشائها</p>
          </div>
          <button onClick={() => navigate('/new')} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            مذكرة جديدة
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pr-10"
                placeholder="بحث عن مذكرة..."
              />
            </div>
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="input-field w-48"
          >
            {levelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">لا توجد مذكرات</h3>
            <p className="text-gray-400">قم بإنشاء أول مذكرة لك باستخدام الذكاء الاصطناعي</p>
            <button onClick={() => navigate('/new')} className="btn-primary mt-4">
              إنشاء مذكرة جديدة
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <div key={lesson.id} className="card hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    {levelLabels[lesson.level] || lesson.level}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(lesson.createdAt).toLocaleDateString('ar-DZ')}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{lesson.title}</h3>
                <p className="text-sm text-gray-500 mb-2">الوحدة: {lesson.unit}</p>
                <p className="text-xs text-gray-400 mb-4">المدة: {lesson.duration} دقيقة</p>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="text-primary-600 hover:text-primary-800 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentLesson(lesson);
                      navigate(`/editor/${lesson.id}`);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;