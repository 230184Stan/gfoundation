import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import TeamCard from '@/components/TeamCard';
import { getSettings, getTeam } from '@/lib/data';

export const revalidate = 60;
export const metadata: Metadata = { title: 'About Us' };

export default async function AboutPage() {
  const [{ about }, team] = await Promise.all([getSettings(), getTeam()]);
  const executives = team.filter((m) => m.group_name === 'executive');
  const training = team.filter((m) => m.group_name === 'training');

  return (
    <>
      <PageHero
        variant="about-hero"
        title="About Us"
        subtitle="Who we are, what drives us, and the people behind the mission."
      />

      <section className="section">
        <div className="container two-col">
          <div>
            <h2>Our Vision</h2>
            <p>{about.vision}</p>
            <h2 style={{ marginTop: '2rem' }}>Our Mission</h2>
            <p>{about.mission}</p>
            <h2 style={{ marginTop: '2rem' }}>Our Location</h2>
            <p>{about.location_text}</p>
          </div>
          <div>
            <img src="/assets/logo.png" alt="Gamuna Foundation" className="about-logo" />
          </div>
        </div>
      </section>

      {executives.length > 0 && (
        <section className="section team-section">
          <div className="container">
            <h2 className="section-title">Executive Team</h2>
            <div className="team-cards-grid">
              {executives.map((m) => <TeamCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      )}

      {training.length > 0 && (
        <section className="section committee-section">
          <div className="container">
            <h2 className="section-title">Training Committee</h2>
            <div className="team-cards-grid committee-grid">
              {training.map((m) => <TeamCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
