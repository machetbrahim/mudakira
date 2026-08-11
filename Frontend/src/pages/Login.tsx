import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('مرحباً بك في مذكرتي في العلوم الفيزيائية AI');
        navigate('/');
      } else {
        toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <GraduationCap className="w-12 h-12 text-primary-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">مذكرتي في العلوم الفيزيائية</h1>
          <p className="text-gray-500 mt-1">الذكاء الاصطناعي لإنشاء المذكرات البيداغوجية</p>
          <p className="text-xs text-gray-400 mt-2">© 2026 Brahim Machet — جميع الحقوق محفوظة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-field">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="example@email.com"
              required
              dir="ltr"
            />
          </div>

          <div>
            <label className="label-field">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              dir="ltr"
              minLength={4}
            />
            <p className="text-xs text-gray-400 mt-1">أدخل أي كلمة مرور (4 أحرف على الأقل)</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>نسخة تجريبية • جميع الحقوق محفوظة</p>
          <p className="text-xs mt-1">إعداد وتصميم: المخبري إبراهيم معشت</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
