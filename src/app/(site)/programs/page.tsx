import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { getEvents, getPrograms, getSettings } from '@/lib/data';
import { capitalise, eventDateParts } from '@/lib/format';
import type { EventRow } from '@/lib/types';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Programs & Events' };

function EventCard({ event, past }: { event: EventRow; past?: boolean }) {
  const d = eventDateParts(event.event_date);
  return (
    <div className={`event-card ${past ? 'event-past' : 'event-upcoming'}`}>
      <div className={`event-date-box${past ? ' past' : ''}`}>
        <span className="event-month">{d.month}</span>
        <span className="event-day">{d.day}</span>
        <span className="event-year">{d.year}</span>
      </div>
      <div className="event-details">
        <span className={`event-badge badge-${event.badge}`}>{capitalise(event.badge)}</span>
        <h3 className="event-title">{event.title}</h3>
        {event.description && <p className="event-desc">{event.description}</p>}
        <div className="event-meta">
          {event.location && <span>📍 {event.location}</span>}
          {!past && event.time_label && <span>🕘 {event.time_label}</span>}
          {past && event.outcome && <span>✅ {event.outcome}</span>}
        </div>
      </div>
    </div>
  );
}

export default async function ProgramsPage() {
  const [programs, { upcoming, past }, { partners }] = await Promise.all([
    getPrograms(),
    getEvents(),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        variant="programs-hero"
        title="Programs & Events"
        subtitle="What we do, where we've been, and what's coming next."
      />

      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Core Programs</h2>
          <div className="programs-list">
            {programs.map((p, i) => (
              <div className="program-item" key={p.id}>
                <div className="program-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="program-body">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section events-section">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          {upcoming.length > 0 ? (
            <div className="events-grid">
              {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          ) : (
            <div className="no-events">
              <p>
                🗓️ No upcoming events at the moment. Check back soon or{' '}
                <Link href="/contact">contact us</Link> to get involved.
              </p>
            </div>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="section past-events-section">
          <div className="container">
            <h2 className="section-title">Past Events</h2>
            <div className="events-grid">
              {past.map((e) => <EventCard key={e.id} event={e} past />)}
            </div>
          </div>
        </section>
      )}

      <section className="section partners-section">
        <div className="container">
          <h2 className="section-title">Partnerships</h2>
          <p className="partners-text">{partners.text}</p>
          <div className="center">
            <Link href="/contact" className="btn btn-primary">Partner With Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
