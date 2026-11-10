import Link from 'next/link';
import { getPillars, getSettings } from '@/lib/data';

export const revalidate = 60;

export default async function HomePage() {
  const [{ home }, pillars] = await Promise.all([getSettings(), getPillars()]);
  const titleLines = home.title.split('\n');

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">{home.eyebrow}</p>
          <h1 className="hero-title">
            {titleLines.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </h1>
          <p className="hero-sub">{home.subtitle}</p>
          <div className="hero-btns">
            <Link href="/programs" className="btn btn-primary">Our Programs</Link>
            <Link href="/contact" className="btn btn-outline">Get Involved</Link>
          </div>
        </div>
      </section>

      {pillars.length > 0 && (
        <section className="pillars section">
          <div className="container">
            <h2 className="section-title">What We Stand For</h2>
            <div className="pillars-grid">
              {pillars.map((p) => (
                <div className="pillar-card" key={p.id}>
                  <div className="pillar-icon">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mission-strip">
        <div className="container">
          <p className="mission-label">Our Mission</p>
          <blockquote className="mission-quote">“{home.mission_quote}”</blockquote>
        </div>
      </section>
    </>
  );
}
