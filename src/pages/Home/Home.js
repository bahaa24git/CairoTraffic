import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { reportsService, roadsService, newsService } from '../../services/api';
import { Loading, StatusBadge } from '../../components/common';

const statusLabel = { smooth: 'سلس', moderate: 'معتدل', congested: 'مزدحم', severe: 'شديد' };
const statusBar = { smooth: 'bg-emerald-500', moderate: 'bg-amber-500', congested: 'bg-orange-500', severe: 'bg-red-500' };

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [roads, setRoads] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { isLoaded: isMapLoaded, loadError: mapLoadError } = useJsApiLoader({
    id: 'cairo-traffic-google-map',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, r, n] = await Promise.all([
          reportsService.getSummary(),
          roadsService.getAll(),
          newsService.getAll()
        ]);
        setSummary(s.data);
        setRoads(r.data.roads || []);
        setNews(n.data.news?.slice(0, 3) || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const mapCenter = { lat: 30.0444, lng: 31.2357 };
  const mapOptions = {
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#1a1d29' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1d29' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
      { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#374151' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#4b5563' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#0ea5e9' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c4a7a' }] }
    ],
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false
  };

  const roadMarkers = roads.filter(road => road.latitude && road.longitude);

  return (
    <div className="hero-bg min-h-screen" dir="rtl">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#14b8a6" strokeWidth="0.5"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 text-teal-400 text-sm mb-6">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
                مراقبة مستمرة على مدار الساعة
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                القاهرة الذكية
                <span className="block text-transparent bg-clip-text bg-gradient-to-l from-teal-400 to-emerald-400">
                  للمرور
                </span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">
                منصة متطورة لإدارة ومراقبة حركة المرور في القاهرة الكبرى باستخدام أحدث تقنيات الذكاء الاصطناعي وإنترنت الأشياء في الوقت الحقيقي.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/traffic" className="btn-primary text-base py-3 px-6">
                  🚦 تابع حالة المرور
                </Link>
                <Link to="/about" className="btn-secondary text-base py-3 px-6">
                  تعرف على المشروع
                </Link>
              </div>

              {/* Quick stats */}
              {!loading && summary && (
                <div className="grid grid-cols-3 gap-4 mt-10">
                  {[
                    { v: summary.totalRoads, l: 'طريق مراقب', icon: '🛣️' },
                    { v: summary.camerasOnline, l: 'كاميرا فعالة', icon: '📷' },
                    { v: summary.activeIncidents, l: 'حادث نشط', icon: '⚠️' },
                  ].map((s, i) => (
                    <div key={i} className="glass-card p-4 text-center">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="text-2xl font-black text-teal-400">{s.v}</div>
                      <div className="text-slate-500 text-xs">{s.l}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mock map visual */}
            <div className="relative min-w-0 w-full">
              <div className="glass-card p-3 sm:p-4 relative overflow-hidden h-[360px] sm:h-[420px] lg:h-[450px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-teal-400 text-sm font-semibold">🗺️ خريطة المرور - القاهرة الكبرى</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> مباشر
                  </span>
                </div>
                <div className="relative h-[calc(100%-2.25rem)] bg-navy-700/50 rounded-lg overflow-hidden">
                  {mapLoadError ? (
                    <div className="h-full flex items-center justify-center text-red-400 text-sm">
                      تعذر تحميل الخريطة
                    </div>
                  ) : !isMapLoaded ? (
                    <div className="h-full flex items-center justify-center">
                      <Loading />
                    </div>
                  ) : (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={mapCenter}
                      zoom={12}
                      options={mapOptions}
                    >
                      {roadMarkers.map(road => {
                        const iconUrl = road.status === 'smooth'
                          ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                          : road.status === 'moderate'
                            ? 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                            : road.status === 'congested'
                              ? 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
                        return (
                          <Marker
                            key={road._id}
                            position={{ lat: parseFloat(road.latitude), lng: parseFloat(road.longitude) }}
                            title={road.name}
                            icon={{
                              url: iconUrl,
                            }}
                          />
                        );
                      })}
                    </GoogleMap>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live stats dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">الإحصائيات الحية</h2>
          <p className="text-slate-400">بيانات محدثة في الوقت الفعلي من شبكة الحساسات والكاميرات</p>
            
        </div>

        {loading ? <Loading /> : summary ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {[
              { icon: '🛣️', label: 'إجمالي الطرق', value: summary.totalRoads, color: 'teal' },
              { icon: '⚠️', label: 'حوادث نشطة', value: summary.activeIncidents, color: 'red' },
              { icon: '🚗', label: 'متوسط السرعة', value: `${summary.avgSpeed} كم/س`, color: 'green' },
              { icon: '🔴', label: 'طرق مزدحمة', value: summary.congestedRoads, color: 'orange' },
              { icon: '📷', label: 'كاميرات متصلة', value: `${summary.camerasOnline}/${summary.totalCameras}`, color: 'blue' },
              { icon: '📡', label: 'حساسات فعالة', value: `${summary.sensorsOnline}/${summary.totalSensors}`, color: 'amber' },
            ].map((s, i) => (
              <div key={i} className="glass-card p-4 text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-black text-teal-400">{s.value}</div>
                <div className="text-slate-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Congested Roads */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white">أكثر الطرق ازدحاماً</h2>
          <Link to="/traffic" className="text-teal-400 hover:text-teal-300 text-sm transition-colors">عرض الكل ←</Link>
        </div>
        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roads.sort((a, b) => b.congestionPercentage - a.congestionPercentage).slice(0, 6).map(road => (
              <div key={road._id} className="glass-card p-4 hover:border-teal-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{road.name}</h3>
                    <p className="text-slate-500 text-xs">{road.area} • {road.lengthKm} كم</p>
                  </div>
                  <StatusBadge status={road.status} type="road" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>الازدحام: {road.congestionPercentage}%</span>
                  <span>السرعة: {road.averageSpeed} كم/س</span>
                </div>
                <div className="w-full bg-navy-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${statusBar[road.status]}`}
                    style={{ width: `${road.congestionPercentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">مميزات المنصة</h2>
          <p className="text-slate-400">تقنيات متطورة لإدارة المرور بكفاءة عالية</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🤖', title: 'ذكاء اصطناعي', desc: 'تحليل حركة المرور باستخدام خوارزميات الذكاء الاصطناعي للتنبؤ بالازدحام' },
            { icon: '📡', title: 'شبكة حساسات', desc: 'شبكة متكاملة من الحساسات الذكية لقياس الكثافة والسرعة في الوقت الفعلي' },
            { icon: '📷', title: 'كاميرات ذكية', desc: 'كاميرات متطورة مع رؤية حاسوبية لرصد المخالفات والحوادث تلقائياً' },
            { icon: '📊', title: 'تحليلات متقدمة', desc: 'تقارير وإحصاءات تفصيلية لدعم اتخاذ القرار وتخطيط البنية التحتية' },
            { icon: '🚨', title: 'إنذار فوري', desc: 'نظام إنذار مبكر يُخطر فرق الطوارئ فور وقوع أي حادث أو طارئ' },
            { icon: '🌐', title: 'تكامل شامل', desc: 'تكامل مع أنظمة النقل العام والإشارات المرورية والخرائط الذكية' },
          ].map((f, i) => (
            <div key={i} className="glass-card p-6 hover:border-teal-500/30 hover:scale-105 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-white/5">
        <h2 className="text-2xl font-black text-white mb-8 text-center">التقنيات المستخدمة</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {['React.js', 'Node.js', 'SQLite', 'Express.js', 'Tailwind CSS', 'JWT Auth', 'REST API', 'Recharts', 'IoT Sensors', 'AI/ML'].map(t => (
            <span key={t} className="glass-card px-4 py-2 text-sm text-teal-400 font-medium border-teal-500/20 hover:border-teal-400/40 transition-colors cursor-default">{t}</span>
          ))}
        </div>
      </section>

      {/* Beneficiaries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-black text-white mb-8 text-center">المستفيدون من المنصة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🏛️', title: 'الجهات الحكومية', desc: 'وزارة النقل ومحافظة القاهرة' },
            { icon: '🚔', title: 'هيئة المرور', desc: 'ضباط ومراقبو المرور' },
            { icon: '🚑', title: 'خدمات الطوارئ', desc: 'الإسعاف، الإطفاء، الشرطة' },
            { icon: '👥', title: 'المواطنون', desc: 'سائقو السيارات والمشاة' },
          ].map((b, i) => (
            <div key={i} className="glass-card p-5 text-center hover:border-teal-500/30 transition-all">
              <div className="text-4xl mb-3">{b.icon}</div>
              <h3 className="text-white font-semibold mb-1">{b.title}</h3>
              <p className="text-slate-500 text-xs">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News */}
      {news.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white">آخر الأخبار</h2>
            <Link to="/news" className="text-teal-400 hover:text-teal-300 text-sm transition-colors">عرض الكل ←</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map(item => (
              <div key={item._id} className="glass-card overflow-hidden hover:border-teal-500/30 transition-all hover:scale-[1.02] group">
                {item.imageUrl && (
                  <div className="h-44 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-teal-500 text-xs mb-2">{new Date(item.publishedAt).toLocaleDateString('ar-EG')}</p>
                  <h3 className="text-white font-bold mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="glass-card p-8 text-center bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-teal-500/20">
          <h2 className="text-2xl font-black text-white mb-3">اشترك في النشرة الإخبارية</h2>
          <p className="text-slate-400 mb-6">احصل على آخر تحديثات المرور والأخبار مباشرة على بريدك الإلكتروني</p>
          {subscribed ? (
            <div className="text-emerald-400 text-lg">✅ تم اشتراكك بنجاح! شكراً لك</div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني" className="form-input flex-1" required />
              <button type="submit" className="btn-primary whitespace-nowrap">اشترك الآن</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
