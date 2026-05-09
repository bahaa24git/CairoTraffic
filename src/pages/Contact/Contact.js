export default function Contact() {
  return (
    <main className="page">
      <section className="page-hero">
        <h1>اتصل بنا</h1>
        <p>يمكنك التواصل مع فريق مشروع القاهرة الذكية للمرور من خلال البيانات التالية.</p>
      </section>

      <section className="cards-grid">
        <div className="info-card">
          <h3>العنوان</h3>
          <p>القاهرة، جمهورية مصر العربية</p>
        </div>

        <div className="info-card">
          <h3>الهاتف</h3>
          <p>19116</p>
        </div>

        <div className="info-card">
          <h3>البريد الإلكتروني</h3>
          <p>info@cairo-traffic.gov.eg</p>
        </div>
      </section>
    </main>
  );
}