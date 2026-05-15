import { useEffect, useMemo, useState } from "react";
import {
  camerasService,
  incidentsService,
  newsService,
  reportsService,
  roadsService,
  sensorsService,
  usersService,
} from "../../services/api";
import { notifyDataChanged } from "../../hooks/useRefreshingData";

const emptyRoad = {
  name: "",
  area: "",
  lengthKm: "",
  status: "moderate",
  congestionPercentage: "",
  averageSpeed: "",
};

const emptyNews = {
  title: "",
  content: "",
  imageUrl: "",
  category: "traffic",
  publishedAt: "",
};

const emptyIncident = {
  title: "",
  type: "accident",
  severity: "medium",
  status: "active",
  location: "",
};

const emptyDevice = {
  name: "",
  location: "",
  status: "online",
};

const emptyUser = {
  fullName: "",
  email: "",
  password: "",
  role: "user",
  isActive: "true",
};

const tabs = [
  { id: "roads", label: "الطرق" },
  { id: "incidents", label: "الحوادث والبلاغات" },
  { id: "news", label: "الأخبار" },
  { id: "cameras", label: "الكاميرات" },
  { id: "sensors", label: "الحساسات" },
  { id: "users", label: "المستخدمون" },
  { id: "reports", label: "لوحة التقارير" },
];

const roadStatuses = [
  ["smooth", "سلس"],
  ["moderate", "معتدل"],
  ["congested", "مزدحم"],
  ["severe", "شديد"],
];

const deviceStatuses = [
  ["online", "متصل"],
  ["offline", "غير متصل"],
  ["maintenance", "صيانة"],
];

const incidentTypes = [
  ["accident", "حادث"],
  ["breakdown", "تعطل"],
  ["maintenance", "صيانة"],
  ["traffic", "مرور"],
];

const severityOptions = [
  ["low", "منخفض"],
  ["medium", "متوسط"],
  ["high", "مرتفع"],
  ["critical", "حرج"],
];

const incidentStatuses = [
  ["active", "نشط"],
  ["resolved", "تم الحل"],
];

const userRoles = [
  ["user", "مستخدم"],
  ["admin", "مدير"],
];

const activeOptions = [
  ["true", "نشط"],
  ["false", "غير نشط"],
];

const getId = (item) => item.id || item._id;
const toNumber = (value) => Number(value || 0);

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ label, value, onChange, type = "text", required = false }) {
  return (
    <Field label={label}>
      <input
        className="input-field"
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select className="input-field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </Field>
  );
}

function TextArea({ label, value, onChange, required = false }) {
  return (
    <Field label={label}>
      <textarea
        className="input-field min-h-32"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

function AdminForm({ title, editing, onSubmit, onCancel, children }) {
  return (
    <form onSubmit={onSubmit} className="glass-card p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">{editing ? `تعديل ${title}` : `إضافة ${title}`}</h2>
        {editing && (
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300">
            إلغاء
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
      <button className="btn-primary mt-5 w-full">{editing ? "حفظ التعديل" : "إضافة"}</button>
    </form>
  );
}

function DataList({ title, items, emptyText, renderMeta, onEdit, onDelete }) {
  return (
    <div className="glass-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="rounded-full bg-teal-500/10 px-3 py-1 text-sm text-teal-300">{items.length}</span>
      </div>

      <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-slate-400">{emptyText}</p>
        ) : items.map((item) => (
          <div key={getId(item)} className="rounded-lg border border-slate-700 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white">{item.name || item.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{renderMeta(item)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => onEdit(item)} className="rounded-lg bg-teal-500/20 px-3 py-2 text-sm text-teal-300">
                  تعديل
                </button>
                <button type="button" onClick={() => onDelete(getId(item))} className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-300">
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const [section, setSection] = useState("roads");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});

  const [roads, setRoads] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [congestionReport, setCongestionReport] = useState([]);
  const [incidentReport, setIncidentReport] = useState([]);

  const [road, setRoad] = useState(emptyRoad);
  const [news, setNews] = useState(emptyNews);
  const [incident, setIncident] = useState(emptyIncident);
  const [camera, setCamera] = useState(emptyDevice);
  const [sensor, setSensor] = useState(emptyDevice);
  const [user, setUser] = useState(emptyUser);

  const stats = useMemo(() => [
    ["الطرق", summary?.totalRoads ?? roads.length],
    ["الطرق المزدحمة", summary?.congestedRoads ?? 0],
    ["الحوادث النشطة", summary?.activeIncidents ?? incidents.filter(item => item.status === "active").length],
    ["متوسط السرعة", `${summary?.avgSpeed ?? 0} كم/س`],
    ["الكاميرات المتصلة", `${summary?.camerasOnline ?? 0}/${summary?.totalCameras ?? cameras.length}`],
    ["الحساسات المتصلة", `${summary?.sensorsOnline ?? 0}/${summary?.totalSensors ?? sensors.length}`],
  ], [cameras.length, incidents, roads.length, sensors.length, summary]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const canLoadUsers = user?.role === "admin";
      const [roadsRes, newsRes, incidentsRes, camerasRes, sensorsRes, usersRes, summaryRes, congestionRes, incidentReportRes] = await Promise.all([
        roadsService.getAll(),
        newsService.getAll(),
        incidentsService.getAll(),
        camerasService.getAll(),
        sensorsService.getAll(),
        canLoadUsers ? usersService.getAll() : Promise.resolve({ data: { users: [] } }),
        reportsService.getSummary(),
        reportsService.getCongestion(),
        reportsService.getIncidents(),
      ]);

      setRoads(roadsRes.data.roads || []);
      setNewsItems(newsRes.data.news || []);
      setIncidents(incidentsRes.data.incidents || []);
      setCameras(camerasRes.data.cameras || []);
      setSensors(sensorsRes.data.sensors || []);
      setUsers(usersRes.data.users || []);
      setSummary(summaryRes.data);
      setCongestionReport(congestionRes.data.roads || []);
      setIncidentReport(incidentReportRes.data.incidents || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "تعذر تحميل بيانات لوحة التحكم.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const showSuccess = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3000);
  };

  const runAction = async (action, successText) => {
    try {
      await action();
      await loadAll();
      notifyDataChanged();
      showSuccess(successText);
      return true;
    } catch (error) {
      setMessage(error.response?.data?.message || "تعذر تنفيذ العملية.");
      console.error(error);
      return false;
    }
  };

  const resetRoad = () => {
    setRoad(emptyRoad);
    setEditing(current => ({ ...current, roads: null }));
  };

  const resetNews = () => {
    setNews(emptyNews);
    setEditing(current => ({ ...current, news: null }));
  };

  const resetIncident = () => {
    setIncident(emptyIncident);
    setEditing(current => ({ ...current, incidents: null }));
  };

  const resetCamera = () => {
    setCamera(emptyDevice);
    setEditing(current => ({ ...current, cameras: null }));
  };

  const resetSensor = () => {
    setSensor(emptyDevice);
    setEditing(current => ({ ...current, sensors: null }));
  };

  const resetUser = () => {
    setUser(emptyUser);
    setEditing(current => ({ ...current, users: null }));
  };

  const saveRoad = (event) => {
    event.preventDefault();
    const id = editing.roads;
    const payload = {
      ...road,
      lengthKm: toNumber(road.lengthKm),
      averageSpeed: toNumber(road.averageSpeed),
      congestionPercentage: toNumber(road.congestionPercentage),
    };

    runAction(
      () => id ? roadsService.update(id, payload) : roadsService.create(payload),
      id ? "تم تعديل الطريق." : "تمت إضافة الطريق."
    ).then((ok) => ok && resetRoad());
  };

  const saveNews = (event) => {
    event.preventDefault();
    const id = editing.news;
    const payload = { ...news, publishedAt: news.publishedAt || new Date().toISOString() };

    runAction(
      () => id ? newsService.update(id, payload) : newsService.create(payload),
      id ? "تم تعديل الخبر." : "تمت إضافة الخبر."
    ).then((ok) => ok && resetNews());
  };

  const saveIncident = (event) => {
    event.preventDefault();
    const id = editing.incidents;

    runAction(
      () => id ? incidentsService.update(id, incident) : incidentsService.create(incident),
      id ? "تم تعديل البلاغ." : "تمت إضافة البلاغ."
    ).then((ok) => ok && resetIncident());
  };

  const saveDevice = (event, kind) => {
    event.preventDefault();
    const isCamera = kind === "cameras";
    const id = editing[kind];
    const service = isCamera ? camerasService : sensorsService;
    const form = isCamera ? camera : sensor;
    const reset = isCamera ? resetCamera : resetSensor;
    const label = isCamera ? "الكاميرا" : "الحساس";

    runAction(
      () => id ? service.update(id, form) : service.create(form),
      id ? `تم تعديل ${label}.` : `تمت إضافة ${label}.`
    ).then((ok) => ok && reset());
  };

  const saveUser = (event) => {
    event.preventDefault();
    const id = editing.users;
    const payload = {
      ...user,
      isActive: user.isActive === true || user.isActive === "true",
    };

    if (id && !payload.password) {
      delete payload.password;
    }

    runAction(
      () => id ? usersService.update(id, payload) : usersService.create(payload),
      id ? "تم تعديل المستخدم." : "تمت إضافة المستخدم."
    ).then((ok) => ok && resetUser());
  };

  const editRoad = (item) => {
    setRoad({
      name: item.name || "",
      area: item.area || "",
      lengthKm: item.lengthKm ?? "",
      status: item.status || "moderate",
      congestionPercentage: item.congestionPercentage ?? "",
      averageSpeed: item.averageSpeed ?? "",
    });
    setEditing(current => ({ ...current, roads: getId(item) }));
    setSection("roads");
  };

  const editNews = (item) => {
    setNews({
      title: item.title || "",
      content: item.content || "",
      imageUrl: item.imageUrl || "",
      category: item.category || "traffic",
      publishedAt: item.publishedAt || "",
    });
    setEditing(current => ({ ...current, news: getId(item) }));
    setSection("news");
  };

  const editIncident = (item) => {
    setIncident({
      title: item.title || "",
      type: item.type || "accident",
      severity: item.severity || "medium",
      status: item.status || "active",
      location: item.location || "",
    });
    setEditing(current => ({ ...current, incidents: getId(item) }));
    setSection("incidents");
  };

  const editDevice = (item, kind) => {
    const value = {
      name: item.name || "",
      location: item.location || "",
      status: item.status || "online",
    };

    if (kind === "cameras") setCamera(value);
    else setSensor(value);

    setEditing(current => ({ ...current, [kind]: getId(item) }));
    setSection(kind);
  };

  const editUser = (item) => {
    setUser({
      fullName: item.fullName || "",
      email: item.email || "",
      password: "",
      role: item.role || "user",
      isActive: String(Boolean(item.isActive)),
    });
    setEditing(current => ({ ...current, users: getId(item) }));
    setSection("users");
  };

  const confirmDelete = (label, action) => {
    if (!window.confirm(`هل تريد حذف ${label}؟`)) return;
    runAction(action, `تم حذف ${label}.`);
  };

  return (
    <main className="hero-bg min-h-screen pt-28 pb-16" dir="rtl">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-black text-white">لوحة التحكم</h1>
          <p className="max-w-3xl text-slate-400">
            إدارة بيانات النظام: الطرق، الحوادث، البلاغات، الأخبار، الكاميرات، الحساسات، والمستخدمين.
          </p>
        </div>

        {message && (
          <div className="glass-card mb-6 border-teal-500/30 p-4 text-teal-300">{message}</div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                section === tab.id
                  ? "border-teal-400 bg-teal-500/20 text-teal-200"
                  : "border-slate-700 bg-slate-900/30 text-slate-300 hover:border-slate-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="glass-card p-8 text-center text-slate-300">جار تحميل بيانات لوحة التحكم...</div>
        ) : (
          <>
            {section === "roads" && (
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AdminForm title="طريق" editing={editing.roads} onSubmit={saveRoad} onCancel={resetRoad}>
                  <TextInput label="اسم الطريق" value={road.name} required onChange={(value) => setRoad({ ...road, name: value })} />
                  <TextInput label="المنطقة" value={road.area} onChange={(value) => setRoad({ ...road, area: value })} />
                  <TextInput label="الطول بالكيلومتر" type="number" value={road.lengthKm} onChange={(value) => setRoad({ ...road, lengthKm: value })} />
                  <TextInput label="متوسط السرعة" type="number" value={road.averageSpeed} onChange={(value) => setRoad({ ...road, averageSpeed: value })} />
                  <TextInput label="نسبة الازدحام %" type="number" value={road.congestionPercentage} onChange={(value) => setRoad({ ...road, congestionPercentage: value })} />
                  <SelectInput label="الحالة" value={road.status} options={roadStatuses} onChange={(value) => setRoad({ ...road, status: value })} />
                </AdminForm>
                <DataList
                  title="الطرق"
                  items={roads}
                  emptyText="لا توجد طرق بعد."
                  renderMeta={(item) => `${item.area || "بدون منطقة"} | ${item.status} | ازدحام ${item.congestionPercentage}% | ${item.averageSpeed} كم/س`}
                  onEdit={editRoad}
                  onDelete={(id) => confirmDelete("الطريق", () => roadsService.delete(id))}
                />
              </section>
            )}

            {section === "news" && (
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AdminForm title="خبر" editing={editing.news} onSubmit={saveNews} onCancel={resetNews}>
                  <TextInput label="العنوان" value={news.title} required onChange={(value) => setNews({ ...news, title: value })} />
                  <TextInput label="التصنيف" value={news.category} onChange={(value) => setNews({ ...news, category: value })} />
                  <TextInput label="رابط الصورة" value={news.imageUrl} onChange={(value) => setNews({ ...news, imageUrl: value })} />
                  <TextInput label="تاريخ النشر" value={news.publishedAt} onChange={(value) => setNews({ ...news, publishedAt: value })} />
                  <div className="md:col-span-2">
                    <TextArea label="المحتوى" value={news.content} required onChange={(value) => setNews({ ...news, content: value })} />
                  </div>
                </AdminForm>
                <DataList
                  title="الأخبار"
                  items={newsItems}
                  emptyText="لا توجد أخبار بعد."
                  renderMeta={(item) => `${item.category || "traffic"} | ${new Date(item.publishedAt).toLocaleDateString()}`}
                  onEdit={editNews}
                  onDelete={(id) => confirmDelete("الخبر", () => newsService.delete(id))}
                />
              </section>
            )}

            {section === "incidents" && (
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AdminForm title="حادث أو بلاغ" editing={editing.incidents} onSubmit={saveIncident} onCancel={resetIncident}>
                  <TextInput label="العنوان" value={incident.title} required onChange={(value) => setIncident({ ...incident, title: value })} />
                  <TextInput label="الموقع / اسم الطريق" value={incident.location} onChange={(value) => setIncident({ ...incident, location: value })} />
                  <SelectInput label="النوع" value={incident.type} options={incidentTypes} onChange={(value) => setIncident({ ...incident, type: value })} />
                  <SelectInput label="الخطورة" value={incident.severity} options={severityOptions} onChange={(value) => setIncident({ ...incident, severity: value })} />
                  <SelectInput label="الحالة" value={incident.status} options={incidentStatuses} onChange={(value) => setIncident({ ...incident, status: value })} />
                </AdminForm>
                <DataList
                  title="الحوادث والبلاغات"
                  items={incidents}
                  emptyText="لا توجد حوادث أو بلاغات بعد."
                  renderMeta={(item) => `${item.location || "بدون موقع"} | ${item.type} | ${item.severity} | ${item.status}`}
                  onEdit={editIncident}
                  onDelete={(id) => confirmDelete("البلاغ", () => incidentsService.delete(id))}
                />
              </section>
            )}

            {section === "cameras" && (
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AdminForm title="كاميرا" editing={editing.cameras} onSubmit={(event) => saveDevice(event, "cameras")} onCancel={resetCamera}>
                  <TextInput label="اسم الكاميرا" value={camera.name} required onChange={(value) => setCamera({ ...camera, name: value })} />
                  <TextInput label="الموقع" value={camera.location} onChange={(value) => setCamera({ ...camera, location: value })} />
                  <SelectInput label="الحالة" value={camera.status} options={deviceStatuses} onChange={(value) => setCamera({ ...camera, status: value })} />
                </AdminForm>
                <DataList
                  title="الكاميرات"
                  items={cameras}
                  emptyText="لا توجد كاميرات بعد."
                  renderMeta={(item) => `${item.location || "بدون موقع"} | ${item.status}`}
                  onEdit={(item) => editDevice(item, "cameras")}
                  onDelete={(id) => confirmDelete("الكاميرا", () => camerasService.delete(id))}
                />
              </section>
            )}

            {section === "sensors" && (
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AdminForm title="حساس" editing={editing.sensors} onSubmit={(event) => saveDevice(event, "sensors")} onCancel={resetSensor}>
                  <TextInput label="اسم الحساس" value={sensor.name} required onChange={(value) => setSensor({ ...sensor, name: value })} />
                  <TextInput label="الموقع" value={sensor.location} onChange={(value) => setSensor({ ...sensor, location: value })} />
                  <SelectInput label="الحالة" value={sensor.status} options={deviceStatuses} onChange={(value) => setSensor({ ...sensor, status: value })} />
                </AdminForm>
                <DataList
                  title="الحساسات"
                  items={sensors}
                  emptyText="لا توجد حساسات بعد."
                  renderMeta={(item) => `${item.location || "بدون موقع"} | ${item.status}`}
                  onEdit={(item) => editDevice(item, "sensors")}
                  onDelete={(id) => confirmDelete("الحساس", () => sensorsService.delete(id))}
                />
              </section>
            )}

            {section === "users" && (
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AdminForm title="مستخدم" editing={editing.users} onSubmit={saveUser} onCancel={resetUser}>
                  <TextInput label="الاسم الكامل" value={user.fullName} required onChange={(value) => setUser({ ...user, fullName: value })} />
                  <TextInput label="البريد الإلكتروني" type="email" value={user.email} required onChange={(value) => setUser({ ...user, email: value })} />
                  <TextInput label={editing.users ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"} type="password" value={user.password} required={!editing.users} onChange={(value) => setUser({ ...user, password: value })} />
                  <SelectInput label="الدور" value={user.role} options={userRoles} onChange={(value) => setUser({ ...user, role: value })} />
                  <SelectInput label="الحالة" value={String(user.isActive)} options={activeOptions} onChange={(value) => setUser({ ...user, isActive: value })} />
                </AdminForm>
                <DataList
                  title="المستخدمون"
                  items={users}
                  emptyText="لا يوجد مستخدمون."
                  renderMeta={(item) => `${item.email} | ${item.role} | ${item.isActive ? "نشط" : "غير نشط"}`}
                  onEdit={editUser}
                  onDelete={(id) => confirmDelete("المستخدم", () => usersService.delete(id))}
                />
              </section>
            )}

            {section === "reports" && (
              <section className="space-y-6">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
                  {stats.map(([label, value]) => (
                    <div key={label} className="glass-card p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                      <p className="mt-2 text-2xl font-black text-teal-300">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="glass-card p-6">
                    <h2 className="mb-4 text-2xl font-bold text-white">تقرير الازدحام</h2>
                    <div className="space-y-3">
                      {congestionReport.map(item => (
                        <div key={`${item.name}-${item.area}`} className="rounded-lg border border-slate-700 p-3">
                          <div className="flex justify-between gap-3 text-sm">
                            <span className="font-semibold text-white">{item.name}</span>
                            <span className="text-teal-300">{item.congestionPercentage}%</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-400">{item.area} | {item.status} | {item.averageSpeed} كم/س</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h2 className="mb-4 text-2xl font-bold text-white">تقرير البلاغات</h2>
                    <div className="space-y-3">
                      {incidentReport.map(item => (
                        <div key={`${item.type}-${item.status}-${item.severity}`} className="rounded-lg border border-slate-700 p-3">
                          <div className="flex justify-between gap-3 text-sm">
                            <span className="font-semibold text-white">{item.type}</span>
                            <span className="text-teal-300">{item.count}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-400">{item.status} | {item.severity}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                      التقارير يتم توليدها من الطرق والحوادث والكاميرات والحساسات. عدل هذه البيانات لتحديث قيم التقارير.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
