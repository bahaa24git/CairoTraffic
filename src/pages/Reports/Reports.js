import { useEffect, useState } from "react";
import { reportsService } from "../../services/api";

export default function Reports() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    reportsService
      .getSummary()
.then((res) => {
  const data = res.data.summary || res.data;
  setSummary({
    totalRoads: data.totalRoads ?? 12,
    activeReports: data.activeReports ?? 3,
    resolvedReports: data.resolvedReports ?? 1,
    trafficAlerts: data.trafficAlerts ?? 2,
  });
})      .catch(console.error);
  }, []);

  return (
    <main className="hero-bg min-h-screen pt-28 pb-16" dir="rtl">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-3">التقارير</h1>
          <p className="text-slate-400">
            متابعة التقارير المرورية، البلاغات النشطة، والتنبيهات الخاصة بالطرق.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-6">
            <p className="text-teal-400 text-2xl font-bold">{summary?.totalRoads ?? 12}</p>
            <h3 className="text-white mt-2">إجمالي الطرق</h3>
            <p className="text-slate-500 text-sm mt-2">عدد الطرق المسجلة في النظام</p>
          </div>

          <div className="glass-card p-6">
            <p className="text-orange-400 text-2xl font-bold">{summary?.activeReports ?? 3}</p>
            <h3 className="text-white mt-2">تقارير نشطة</h3>
            <p className="text-slate-500 text-sm mt-2">بلاغات تحتاج إلى متابعة</p>
          </div>

          <div className="glass-card p-6">
            <p className="text-emerald-400 text-2xl font-bold">{summary?.resolvedReports ?? 1}</p>
            <h3 className="text-white mt-2">تقارير تم حلها</h3>
            <p className="text-slate-500 text-sm mt-2">مشاكل تم التعامل معها</p>
          </div>

          <div className="glass-card p-6">
            <p className="text-red-400 text-2xl font-bold">{summary?.trafficAlerts ?? 2}</p>
            <h3 className="text-white mt-2">تنبيهات مرورية</h3>
            <p className="text-slate-500 text-sm mt-2">تنبيهات ازدحام أو حوادث</p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-5">آخر البلاغات</h2>

            <div className="space-y-4">
              {[
                ["حادث بسيط", "شارع رمسيس", "قيد المتابعة", "text-orange-400"],
                ["ازدحام شديد", "كوبري أكتوبر", "نشط", "text-red-400"],
                ["تعطل إشارة", "مدينة نصر", "تم الحل", "text-emerald-400"],
                ["أعمال صيانة", "طريق السويس", "قيد المتابعة", "text-orange-400"],
              ].map(([title, location, status, color], index) => (
                <div key={index} className="flex items-center justify-between border-b border-slate-700/50 pb-3">
                  <div>
                    <h3 className="text-white font-semibold">{title}</h3>
                    <p className="text-slate-500 text-sm">{location}</p>
                  </div>
                  <span className={`${color} text-sm`}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-5">تحليل سريع</h2>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">البلاغات النشطة</span>
                  <span className="text-orange-400">65%</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">المشاكل المحلولة</span>
                  <span className="text-emerald-400">80%</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "80%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">التنبيهات الحرجة</span>
                  <span className="text-red-400">35%</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "35%" }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}