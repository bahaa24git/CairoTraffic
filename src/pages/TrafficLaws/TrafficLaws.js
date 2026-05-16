import { useState } from "react";

const lawGroups = [
  {
    type: "سيارة ملاكي",
    icon: "🚗",
    laws: [
      "الالتزام بالسرعات المقررة على كل طريق وعدم تجاوزها.",
      "ربط حزام الأمان للسائق والراكب الأمامي أثناء السير.",
      "عدم استخدام الهاتف المحمول باليد أثناء القيادة.",
      "الالتزام بالحارة المرورية وعدم تغيير المسار إلا بعد استخدام الإشارة والتأكد من خلو الطريق.",
      "الوقوف في الأماكن المخصصة فقط وتجنب تعطيل حركة المرور أو الوقوف صفاً ثانياً.",
      "حمل رخصة قيادة سارية ورخصة تسيير سارية للسيارة.",
    ],
  },
  {
    type: "نقل ثقيل",
    icon: "🚚",
    laws: [
      "الالتزام بخطوط السير والمواعيد المسموح بها لمركبات النقل الثقيل داخل المدن.",
      "عدم تجاوز الحمولة القانونية أو تحميل المركبة بطريقة تعرض الطريق أو المركبات الأخرى للخطر.",
      "تأمين الحمولة جيداً ووضع العلامات التحذيرية عند نقل مواد بارزة أو خطرة.",
      "الالتزام بالسرعات المخصصة للنقل الثقيل وترك مسافة أمان كافية.",
      "الفحص الدوري للفرامل والإطارات والأنوار قبل التحرك.",
      "عدم السير في الحارات أو الكباري المحظورة على النقل الثقيل.",
    ],
  },
  {
    type: "دراجات بخارية أو نارية",
    icon: "🏍️",
    laws: [
      "ارتداء خوذة الحماية للسائق والراكب طوال مدة السير.",
      "تركيب لوحات معدنية واضحة والالتزام برخصة تسيير ورخصة قيادة ساريتين.",
      "عدم السير عكس الاتجاه أو بين المركبات بطريقة تعرض السائق والآخرين للخطر.",
      "استخدام الأنوار والإشارات الجانبية عند تغيير الاتجاه أو التوقف.",
      "عدم تحميل أكثر من العدد المسموح به للركاب.",
      "الالتزام بالحارة المرورية والسرعات المقررة وعدم القيام بحركات استعراضية على الطريق.",
    ],
  },
];

export default function TrafficLaws() {
  const [openGroup, setOpenGroup] = useState(lawGroups[0].type);

  return (
    <main className="hero-bg min-h-screen pt-28 pb-16" dir="rtl">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-3">قوانين السير والمرور</h1>
          <p className="max-w-3xl text-slate-400">
            أهم قواعد الالتزام المروري حسب نوع المركبة لتقليل المخاطر وتحسين انسياب الحركة على الطرق.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {lawGroups.map((group) => (
            <article key={group.type} className="glass-card overflow-hidden lg:p-6">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 p-5 text-right lg:mb-5 lg:cursor-default lg:p-0"
                onClick={() => setOpenGroup((current) => current === group.type ? "" : group.type)}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/10 text-2xl">
                    {group.icon}
                  </span>
                  <span className="text-xl font-bold text-white sm:text-2xl">{group.type}</span>
                </span>
                <span className={`text-xl text-teal-300 transition-transform lg:hidden ${openGroup === group.type ? "rotate-180" : ""}`}>
                  ↓
                </span>
              </button>

              <ul className={`space-y-3 px-5 pb-5 lg:block lg:px-0 lg:pb-0 ${openGroup === group.type ? "block" : "hidden"}`}>
                {group.laws.map((law) => (
                  <li key={law} className="rounded-lg border border-slate-700/60 bg-slate-950/25 p-3 text-sm leading-7 text-slate-300">
                    {law}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
