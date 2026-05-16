import { useCallback, useState } from "react";
import { sensorsService } from "../../services/api";
import { Loading } from "../../components/common";
import useRefreshingData from "../../hooks/useRefreshingData";

const statusLabel = {
  online: "متصل",
  offline: "غير متصل",
  maintenance: "صيانة",
};

const statusStyle = {
  online: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  offline: "border-red-500/30 bg-red-500/10 text-red-300",
  maintenance: "border-amber-500/30 bg-amber-500/10 text-amber-300",
};

const formatRadarName = (name = "") => name.replace(/\bSensors\b/g, "Radars").replace(/\bSensor\b/g, "Radar");

export default function Radars() {
  const [radars, setRadars] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRadars = useCallback(() => {
    sensorsService
      .getAll()
      .then((res) => setRadars(res.data.sensors || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useRefreshingData(loadRadars, [loadRadars], 8000);

  const onlineCount = radars.filter((radar) => radar.status === "online").length;

  return (
    <main className="hero-bg min-h-screen pt-28 pb-16" dir="rtl">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-3">الرادارات</h1>
            <p className="max-w-3xl text-slate-400">
              متابعة حالة الرادارات الذكية ومواقعها داخل شبكة القاهرة الذكية للمرور.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <div className="glass-card p-4">
              <p className="text-2xl font-black text-teal-300">{radars.length}</p>
              <p className="text-sm text-slate-400">إجمالي الرادارات</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-2xl font-black text-emerald-300">{onlineCount}</p>
              <p className="text-sm text-slate-400">رادارات فعالة</p>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : radars.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-300">لا توجد رادارات مسجلة حالياً.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {radars.map((radar) => (
              <article key={radar._id || radar.id} className="glass-card p-5 hover:border-teal-500/30 transition-all">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">{formatRadarName(radar.name)}</h2>
                    <p className="mt-1 text-sm text-slate-500">{radar.location || "بدون موقع محدد"}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs ${statusStyle[radar.status] || statusStyle.maintenance}`}>
                    {statusLabel[radar.status] || radar.status}
                  </span>
                </div>

                <div className="rounded-lg border border-slate-700/60 bg-slate-950/30 p-4">
                  <p className="text-sm text-slate-400">نوع الجهاز</p>
                  <p className="mt-1 font-semibold text-teal-300">رادار مروري ذكي</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
