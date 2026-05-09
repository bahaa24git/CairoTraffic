export default function About() {
  return (
    <main className="hero-bg min-h-screen pt-28 pb-16" dir="rtl">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 max-w-4xl">
          <h1 className="text-5xl font-black text-white mb-5">عن المشروع</h1>
          <p className="text-slate-300 text-xl leading-10">
            مشروع القاهرة الذكية للمرور هو منصة رقمية تساعد المواطنين على متابعة حالة الطرق
            داخل القاهرة، معرفة الأخبار والتنبيهات المرورية، وإرسال البلاغات عن الازدحام
            أو الحوادث أو أعمال الصيانة.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-teal-400 text-xl font-bold mb-3">هدف المشروع</h3>
            <p className="text-slate-300 leading-8">
              توفير معلومات مرورية واضحة وسريعة تساعد المستخدم على اختيار الطريق الأنسب
              وتقليل وقت الانتظار داخل الزحام.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-teal-400 text-xl font-bold mb-3">الخدمات</h3>
            <p className="text-slate-300 leading-8">
              عرض حالة المرور، متابعة الأخبار، الاطلاع على التقارير، وإرسال البلاغات
              الخاصة بمشاكل الطرق.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-teal-400 text-xl font-bold mb-3">الفكرة</h3>
            <p className="text-slate-300 leading-8">
              تحسين تجربة التنقل داخل القاهرة من خلال منصة بسيطة تجمع المعلومات المهمة
              في مكان واحد.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-5">مميزات المنصة</h2>

            <div className="space-y-4">
              <div className="border-b border-slate-700/50 pb-3">
                <h3 className="text-white font-semibold">متابعة حالة الطرق</h3>
                <p className="text-slate-500 text-sm mt-1">
                  عرض مستوى الازدحام والسرعة المتوسطة لكل طريق.
                </p>
              </div>

              <div className="border-b border-slate-700/50 pb-3">
                <h3 className="text-white font-semibold">تنبيهات وأخبار مرورية</h3>
                <p className="text-slate-500 text-sm mt-1">
                  أخبار مختصرة عن التحويلات، الصيانة، والكثافات المتوقعة.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold">لوحة تحكم للإدارة</h3>
                <p className="text-slate-500 text-sm mt-1">
                  تساعد المسؤولين على إضافة الطرق، الأخبار، والتقارير بسهولة.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-5">كيف يستفيد المستخدم؟</h2>

            <ul className="space-y-4 text-slate-300 leading-8">
              <li>• معرفة الطرق الأكثر ازدحامًا قبل التحرك.</li>
              <li>• متابعة أخبار المرور في مكان واحد.</li>
              <li>• إرسال بلاغات عن الحوادث أو الازدحام.</li>
              <li>• تقليل وقت الرحلة باختيار مسار أفضل.</li>
              <li>• الحصول على تجربة استخدام بسيطة وواضحة.</li>
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}