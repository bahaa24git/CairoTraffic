import { useEffect, useState } from "react";
import { newsService } from "../../services/api";

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
  newsService
    .getAll()
    .then((res) => {
      const newsData = Array.isArray(res.data)
        ? res.data
        : res.data.news || res.data.data || [];

      setNews(newsData);
    })
    .catch(console.error);
}, []);

  return (
    <main className="page">
      <section className="page-hero">
        <h1>الأخبار</h1>
        <p>آخر الأخبار والتنبيهات الخاصة بحركة المرور والطرق.</p>
      </section>

      <section className="cards-grid">
        {news.map((item) => (
          <article className="info-card" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </article>
        ))}
      </section>
    </main>
  );
}