import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/', label: 'الرئيسية' },
  { to: '/about', label: 'عن المشروع' },
  { to: '/traffic', label: 'حالة المرور' },
  { to: '/reports', label: 'التقارير' },
  { to: '/news', label: 'الأخبار' },
  { to: '/contact', label: 'اتصل بنا' },
  { to: '/admin', label: 'لوحة التحكم', requiresRole: 'admin' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-900/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white font-black text-lg">ذ</div>
            <span className="text-white font-bold text-sm leading-tight hidden sm:block">
              القاهرة الذكية<br />
              <span className="text-teal-400 font-normal text-xs">للمرور</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => 
              (!l.requiresRole || (user && user.role === l.requiresRole)) ? (
                <Link key={l.to} to={l.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === l.to ? 'text-teal-400 bg-teal-500/10' : 'text-slate-300 hover:text-teal-400 hover:bg-white/5'}`}>
                  {l.label}
                </Link>
              ) : null
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-slate-400 text-sm">{user.fullName}</span>
                <button onClick={logout} className="text-sm text-slate-400 hover:text-red-400 transition-colors">خروج</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">دخول</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">سجل الآن</Link>
              </>
            )}
          </div>

          {/* Mobile menu btn */}
          <button className="md:hidden text-slate-300 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-navy-800/95 backdrop-blur-md rounded-xl mb-2 p-4 border border-teal-500/10">
            {navLinks.map(l => 
              (!l.requiresRole || (user && user.role === l.requiresRole)) ? (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${location.pathname === l.to ? 'text-teal-400 bg-teal-500/10' : 'text-slate-300 hover:text-teal-400'}`}>
                  {l.label}
                </Link>
              ) : null
            )}
            <div className="border-t border-white/10 mt-3 pt-3 flex gap-3">
              {user ? (
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-sm text-red-400">خروج</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-slate-300">دخول</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-1.5 px-3">سجل الآن</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}