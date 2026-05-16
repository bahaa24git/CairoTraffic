import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-black text-xl">ذ</div>
              <div>
                <h3 className="text-white font-bold text-lg">القاهرة الذكية للمرور</h3>
                <p className="text-teal-400 text-xs">Cairo Smart Traffic Management</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              منصة متكاملة لإدارة حركة المرور في القاهرة الكبرى باستخدام أحدث تقنيات الذكاء الاصطناعي وإنترنت الأشياء.
            </p>
            <div className="flex items-center gap-4 mt-4">
              {['🌐', '📱', '📧'].map((icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/5 hover:bg-teal-500/20 rounded-lg flex items-center justify-center text-sm transition-colors">{icon}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
            <div className="space-y-2">
              {[['/', 'الرئيسية'], ['/about', 'عن المشروع'], ['/traffic', 'حالة المرور'], ['/radars', 'الرادارات'], ['/traffic-laws', 'قوانين المرور'], ['/reports', 'التقارير'], ['/news', 'الأخبار']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-slate-400 hover:text-teal-400 text-sm transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">تواصل معنا</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p>📍 القاهرة، جمهورية مصر العربية</p>
              <p>📞 19116</p>
              <p>✉️ info@cairo-traffic.gov.eg</p>
              <p>🕐 24/7 مراقبة مستمرة</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">© 2024 القاهرة الذكية للمرور. جميع الحقوق محفوظة.</p>
          <p className="text-slate-600 text-xs">تطوير هيئة تكنولوجيا المعلومات - محافظة القاهرة</p>
        </div>
      </div>
    </footer>
  );
}
