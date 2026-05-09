import React from 'react';

export const Loading = ({ text = 'جاري التحميل...' }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="spinner mb-4"></div>
    <p className="text-slate-400">{text}</p>
  </div>
);

export const StatusBadge = ({ status, type = 'road' }) => {
  const roadLabels = { smooth: 'سلس', moderate: 'معتدل', congested: 'مزدحم', severe: 'شديد الازدحام' };
  const incidentLabels = { active: 'نشط', resolved: 'محلول' };
  const severityLabels = { low: 'منخفض', medium: 'متوسط', high: 'مرتفع' };
  const deviceLabels = { online: 'متصل', offline: 'غير متصل' };

  const labels = type === 'road' ? roadLabels : type === 'incident' ? incidentLabels : type === 'severity' ? severityLabels : deviceLabels;
  const colors = {
    smooth: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    congested: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    severe: 'bg-red-500/20 text-red-400 border-red-500/30',
    active: 'bg-red-500/20 text-red-400 border-red-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    online: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    offline: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-slate-500/20 text-slate-400'}`}>
      {labels[status] || status}
    </span>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass-card w-full max-w-lg p-6 z-10 animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const EmptyState = ({ icon, text }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-500">
    <div className="text-5xl mb-4">{icon || '📭'}</div>
    <p className="text-lg">{text || 'لا توجد بيانات'}</p>
  </div>
);

export const StatCard = ({ icon, label, value, sub, color = 'teal' }) => {
  const colorMap = {
    teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/20 text-teal-400',
    green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
  };
  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${colorMap[color]} transition-transform hover:scale-105`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{label}</p>
          <p className={`text-3xl font-bold ${colorMap[color].split(' ')[3]}`}>{value}</p>
          {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
        </div>
        <div className={`text-3xl ${colorMap[color].split(' ')[3]} opacity-80`}>{icon}</div>
      </div>
    </div>
  );
};