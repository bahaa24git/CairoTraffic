import { useEffect, useState } from "react";
import { roadsService, newsService } from "../../services/api";

const emptyRoad = {
  name: "",
  area: "",
  length: "",
  status: "moderate",
  congestionPercentage: "",
  avgSpeed: "",
};

export default function Admin() {
  const [section, setSection] = useState("roads");
  const [message, setMessage] = useState("");
  const [roads, setRoads] = useState([]);
  const [editingRoadId, setEditingRoadId] = useState(null);

  const [road, setRoad] = useState(emptyRoad);
  const [news, setNews] = useState({ title: "", content: "" });

  const loadRoads = async () => {
    const res = await roadsService.getAll();
    const roadsData = Array.isArray(res.data)
      ? res.data
      : res.data.roads || res.data.data || [];

    setRoads(roadsData);
  };

  useEffect(() => {
    loadRoads().catch(console.error);
  }, []);

  const resetRoadForm = () => {
    setRoad(emptyRoad);
    setEditingRoadId(null);
  };

  const saveRoad = async (e) => {
    e.preventDefault();

    const payload = {
      ...road,
      length: Number(road.length),
      congestionPercentage: Number(road.congestionPercentage),
      avgSpeed: Number(road.avgSpeed),
    };

    if (editingRoadId) {
      await roadsService.update(editingRoadId, payload);
      setMessage("تم تعديل الطريق بنجاح");
    } else {
      await roadsService.create(payload);
      setMessage("تمت إضافة الطريق بنجاح");
    }

    resetRoadForm();
    await loadRoads();
  };

  const startEditRoad = (selectedRoad) => {
    setEditingRoadId(selectedRoad.id || selectedRoad._id);
    setRoad({
      name: selectedRoad.name || "",
      area: selectedRoad.area || "",
      length: selectedRoad.length || "",
      status: selectedRoad.status || "moderate",
      congestionPercentage: selectedRoad.congestionPercentage || "",
      avgSpeed: selectedRoad.avgSpeed || "",
    });

    setSection("roads");
    setMessage("");
  };

  const deleteRoad = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا الطريق؟");
    if (!confirmed) return;

    await roadsService.delete(id);
    setMessage("تم حذف الطريق بنجاح");
    await loadRoads();

    if (editingRoadId === id) {
      resetRoadForm();
    }
  };

  const addNews = async (e) => {
    e.preventDefault();
    await newsService.create(news);
    setMessage("تمت إضافة الخبر بنجاح");
    setNews({ title: "", content: "" });
  };

  return (
    <main className="hero-bg min-h-screen pt-28 pb-16" dir="rtl">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-white mb-4">لوحة التحكم</h1>
          <p className="text-slate-400 text-xl">
            إدارة بيانات النظام ومتابعة الطرق والأخبار والتقارير.
          </p>
        </div>

        {message && (
          <div className="glass-card p-4 mb-6 text-emerald-400">
            {message}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button onClick={() => setSection("roads")} className="glass-card p-6 text-right">
            <h2 className="text-2xl font-bold text-white mb-2">إدارة الطرق</h2>
            <p className="text-slate-400">إضافة أو تعديل أو حذف طريق.</p>
          </button>

          <button onClick={() => setSection("news")} className="glass-card p-6 text-right">
            <h2 className="text-2xl font-bold text-white mb-2">إدارة الأخبار</h2>
            <p className="text-slate-400">نشر خبر أو تنبيه مروري جديد.</p>
          </button>

          <button onClick={() => setSection("reports")} className="glass-card p-6 text-right">
            <h2 className="text-2xl font-bold text-white mb-2">إدارة التقارير</h2>
            <p className="text-slate-400">متابعة البلاغات والتقارير.</p>
          </button>
        </section>

        {section === "roads" && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={saveRoad} className="glass-card p-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                {editingRoadId ? "تعديل الطريق" : "إضافة طريق جديد"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="input-field" placeholder="اسم الطريق" value={road.name} onChange={(e) => setRoad({ ...road, name: e.target.value })} />
                <input className="input-field" placeholder="المنطقة" value={road.area} onChange={(e) => setRoad({ ...road, area: e.target.value })} />
                <input className="input-field" placeholder="الطول بالكيلومتر" value={road.length} onChange={(e) => setRoad({ ...road, length: e.target.value })} />
                <input className="input-field" placeholder="متوسط السرعة" value={road.avgSpeed} onChange={(e) => setRoad({ ...road, avgSpeed: e.target.value })} />
                <input className="input-field" placeholder="نسبة الازدحام %" value={road.congestionPercentage} onChange={(e) => setRoad({ ...road, congestionPercentage: e.target.value })} />

                <select className="input-field" value={road.status} onChange={(e) => setRoad({ ...road, status: e.target.value })}>
                  <option value="smooth">سلس</option>
                  <option value="moderate">معتدل</option>
                  <option value="congested">مزدحم</option>
                  <option value="severe">شديد</option>
                </select>
              </div>

              <button className="btn-primary mt-6 w-full">
                {editingRoadId ? "حفظ التعديل" : "حفظ الطريق"}
              </button>

              {editingRoadId && (
                <button
                  type="button"
                  onClick={resetRoadForm}
                  className="mt-3 w-full rounded-xl border border-slate-600 text-slate-300 py-3"
                >
                  إلغاء التعديل
                </button>
              )}
            </form>

            <div className="glass-card p-6">
              <h2 className="text-3xl font-bold text-white mb-6">الطرق الحالية</h2>

              <div className="space-y-4 max-h-[520px] overflow-y-auto">
                {roads.map((item) => {
                  const id = item.id || item._id;

                  return (
                    <div key={id} className="border border-slate-700 rounded-2xl p-4">
                      <h3 className="text-white font-bold text-lg">{item.name}</h3>
                      <p className="text-slate-500 text-sm mt-1">
                        {item.area} • {item.length} كم • {item.congestionPercentage}% ازدحام
                      </p>

                      <div className="flex gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => startEditRoad(item)}
                          className="btn-primary px-5 py-2"
                        >
                          تعديل
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteRoad(id)}
                          className="rounded-xl bg-red-500/20 text-red-400 px-5 py-2 border border-red-500/30"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {section === "news" && (
          <form onSubmit={addNews} className="glass-card p-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-white mb-6">إضافة خبر جديد</h2>

            <input
              className="input-field mb-4"
              placeholder="عنوان الخبر"
              value={news.title}
              onChange={(e) => setNews({ ...news, title: e.target.value })}
            />

            <textarea
              className="input-field min-h-32"
              placeholder="محتوى الخبر"
              value={news.content}
              onChange={(e) => setNews({ ...news, content: e.target.value })}
            />

            <button className="btn-primary mt-6 w-full">نشر الخبر</button>
          </form>
        )}

        {section === "reports" && (
          <div className="glass-card p-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-white mb-4">إدارة التقارير</h2>
            <p className="text-slate-400">
              التقارير حاليًا معروضة في صفحة التقارير.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}