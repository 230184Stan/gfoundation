import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { getNews } from '@/lib/data';
import { longDate } from '@/lib/format';

export const revalidate = 60;
export const metadata: Metadata = { title: 'News & Updates' };

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <PageHero
        title="News & Updates"
        subtitle="Announcements, milestones, and stories from the Gamuna Foundation."
      />
      <section className="section news-section">
        <div className="container">
          <h2 className="section-title">Latest News</h2>
          {news.length > 0 ? (
            <div className="news-list">
              {news.map((item) => (
                <article className="news-item" key={item.id}>
                  <span className="news-tag">{item.tag}</span>
                  <span className="news-date">{item.date_label || longDate(item.published_on)}</span>
                  <h3 className="news-title">{item.title}</h3>
                  {item.image_url && <img src={item.image_url} alt="" className="news-image" loading="lazy" />}
                  <p className="news-body">{item.body}</p>
                  {item.source_url && (
                    <a className="news-source" href={item.source_url} target="_blank" rel="noopener noreferrer">
                      {item.source_label || 'Read more'} &rarr;
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="no-news">
              <p>
                📰 No news posted yet. Check back soon or <Link href="/contact">contact us</Link> for the
                latest updates.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
