import { useCallback, useState } from "react";
import { reportsService } from "../../services/api";
import useRefreshingData from "../../hooks/useRefreshingData";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [congestion, setCongestion] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const loadReports = useCallback(() => {
    Promise.all([
      reportsService.getSummary(),
      reportsService.getCongestion(),
      reportsService.getIncidents(),
    ])
      .then(([summaryRes, congestionRes, incidentsRes]) => {
        const data = summaryRes.data.summary || summaryRes.data;
        setSummary(data);
        setCongestion(congestionRes.data.roads || []);
        setIncidents(incidentsRes.data.incidents || []);
      })
      .catch(console.error);
  }, []);

  useRefreshingData(loadReports, [loadReports], 8000);

  const activeReports = summary?.activeIncidents ?? 0;
  const resolvedReports = incidents
    .filter((item) => item.status === "resolved")
    .reduce((total, item) => total + Number(item.count || 0), 0);
  const alerts = incidents
    .filter((item) => item.status === "active" && ["high", "critical"].includes(item.severity))
    .reduce((total, item) => total + Number(item.count || 0), 0);

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
            <p className="text-teal-400 text-2xl font-bold">{summary?.totalRoads ?? 0}</p>
            <h3 className="text-white mt-2">إجمالي الطرق</h3>
            <p className="text-slate-500 text-sm mt-2">عدد الطرق المسجلة في النظام</p>
          </div>

          <div className="glass-card p-6">
            <p className="text-orange-400 text-2xl font-bold">{activeReports}</p>
            <h3 className="text-white mt-2">تقارير نشطة</h3>
            <p className="text-slate-500 text-sm mt-2">بلاغات تحتاج إلى متابعة</p>
          </div>

          <div className="glass-card p-6">
            <p className="text-emerald-400 text-2xl font-bold">{resolvedReports}</p>
            <h3 className="text-white mt-2">تقارير تم حلها</h3>
            <p className="text-slate-500 text-sm mt-2">مشاكل تم التعامل معها</p>
          </div>

          <div className="glass-card p-6">
            <p className="text-red-400 text-2xl font-bold">{alerts}</p>
            <h3 className="text-white mt-2">تنبيهات مرورية</h3>
            <p className="text-slate-500 text-sm mt-2">تنبيهات ازدحام أو حوادث عالية الخطورة</p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-5">أكثر الطرق ازدحاما</h2>
            <div className="space-y-4">
              {congestion.slice(0, 6).map((road) => (
                <div key={`${road.name}-${road.area}`} className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{road.name}</h3>
                      <p className="text-slate-500 text-sm">{road.area}</p>
                    </div>
                    <span className="text-orange-400 text-sm">{road.congestionPercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-5">تحليل البلاغات</h2>
            <div className="space-y-4">
              {incidents.map((item) => (
                <div key={`${item.type}-${item.status}-${item.severity}`} className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{item.type}</h3>
                      <p className="text-slate-500 text-sm">{item.status} • {item.severity}</p>
                    </div>
                    <span className="text-teal-400 text-sm">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
