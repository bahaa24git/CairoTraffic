import { useCallback, useState } from "react";
import { roadsService } from "../../services/api";
import { Loading } from "../../components/common";
import useRefreshingData from "../../hooks/useRefreshingData";

const statusLabel = {
  smooth: "سلس",
  moderate: "معتدل",
  congested: "مزدحم",
  severe: "شديد",
};

const statusBar = {
  smooth: "bg-emerald-500",
  moderate: "bg-amber-500",
  congested: "bg-orange-500",
  severe: "bg-red-500",
};

export default function Traffic() {
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRoads = useCallback(() => {
    roadsService
      .getAll()
      .then((res) => setRoads(res.data.roads || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useRefreshingData(loadRoads, [loadRoads], 8000);

  return (
    <main className="hero-bg min-h-screen pt-28 pb-16" dir="rtl">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-3">حالة المرور</h1>
          <p className="text-slate-400">
            تابع حالة الطرق الرئيسية والكثافة المرورية داخل القاهرة الكبرى.
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...roads]
              .sort((a, b) => b.congestionPercentage - a.congestionPercentage)
              .map((road) => (
                <div
                  key={road._id || road.id}
                  className="glass-card p-4 hover:border-teal-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{road.name}</h3>
                      <p className="text-slate-500 text-sm">
                        {road.area} • {road.lengthKm} كم
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-sm bg-red-500/10 text-red-400 border border-red-500/30">
                      {statusLabel[road.status] || road.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm">
                      الازدحام: {road.congestionPercentage}%
                    </p>

                    <p className="text-slate-400 text-sm">
                      السرعة: {road.averageSpeed} كم/س
                    </p>

                    <div className="w-full bg-navy-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${statusBar[road.status] || "bg-teal-500"}`}
                        style={{ width: `${road.congestionPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  );
}
