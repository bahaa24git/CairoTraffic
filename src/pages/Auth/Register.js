import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      setError('من فضلك املأ كل البيانات.');
      return;
    }

    if (form.password.length < 6) {
      setError('كلمة المرور يجب ألا تقل عن 6 أحرف.');
      return;
    }

    try {
      setLoading(true);
      await register({ fullName: form.fullName.trim(), email: form.email.trim(), password: form.password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'لم نتمكن من إنشاء الحساب.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-12 px-4 flex items-center justify-center" dir="rtl">
      <section className="w-full max-w-md">
        <div className="glass-card p-7 md:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-2xl font-black">ذ</div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">إنشاء حساب</h1>
            <p className="text-slate-400 text-sm">سجل حسابًا جديدًا في نظام المرور</p>
          </div>

          {error && <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-300 mb-2">الاسم الكامل</label>
              <div className="relative">
                <User className="pointer-events-none absolute right-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input id="fullName" name="fullName" autoComplete="name" value={form.fullName} onChange={handleChange} className="form-input auth-input-rtl-icon-right" placeholder="أحمد محمد" disabled={loading} />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-semibold text-slate-300 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input id="register-email" name="email" type="email" autoComplete="email" dir="ltr" value={form.email} onChange={handleChange} className="form-input auth-input-ltr" placeholder="you@example.com" disabled={loading} />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-semibold text-slate-300 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute right-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input id="register-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={handleChange} className="form-input auth-input-password" placeholder="6 أحرف على الأقل" disabled={loading} />
                <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500 hover:text-teal-400" aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            لديك حساب بالفعل؟ <Link to="/login" className="text-teal-400 hover:text-teal-300 font-semibold">تسجيل الدخول</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
