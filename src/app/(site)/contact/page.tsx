import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { getSettings } from '@/lib/data';
import { telHref } from '@/lib/format';
import { submitMessage } from './actions';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Contact' };

const ERRORS: Record<string, string> = {
  invalid: 'Please fill in your name, a valid email, and a message.',
  unavailable: 'The message service is not available right now. Please email us directly.',
  failed: 'Sorry, we could not send your message. Please try again or email us directly.',
};

const SUBJECTS = [
  ['Partnership', 'Partnership Inquiry'],
  ['Volunteering', 'Volunteering'],
  ['Donation', 'Donation'],
  ['Programs', 'Programs & Training'],
  ['Media', 'Media Inquiry'],
  ['Other', 'Other'],
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { general } = await getSettings();
  const error = searchParams.error ? ERRORS[searchParams.error] : undefined;

  return (
    <>
      <PageHero
        title="Get In Touch"
        subtitle="Partner with us, volunteer, or simply reach out — we'd love to hear from you."
      />
      <section className="section">
        <div className="container two-col">
          <div className="contact-info">
            <h2>Contact Details</h2>
            <div className="contact-block">
              <p className="contact-label">Organization</p>
              <p>{general.org_name}</p>
            </div>
            <div className="contact-block">
              <p className="contact-label">Representative</p>
              <p>{general.representative}</p>
            </div>
            <div className="contact-block">
              <p className="contact-label">Email</p>
              <p><a href={`mailto:${general.email}`}>{general.email}</a></p>
            </div>
            <div className="contact-block">
              <p className="contact-label">Phone</p>
              <p><a href={telHref(general.phone)}>{general.phone}</a></p>
            </div>
            <div className="contact-block">
              <p className="contact-label">Location</p>
              <p>{general.location}</p>
            </div>
          </div>

          <div className="contact-form-wrap">
            <h2>Send a Message</h2>
            <p className="contact-intro">
              This form sends a message directly to our team. We aim to respond within 3 business days.
            </p>
            <form className="contact-form" action={submitMessage}>
              {error && <div className="form-error" role="alert">{error}</div>}

              {/* Honeypot anti-spam — invisible to people */}
              <input type="text" name="website" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <label htmlFor="name">Your Name *</label>
              <input type="text" id="name" name="name" placeholder="Full name" required maxLength={120} />

              <label htmlFor="email">Your Email *</label>
              <input type="email" id="email" name="email" placeholder="your@email.com" required maxLength={200} />

              <label htmlFor="phone">Phone Number (optional)</label>
              <input type="tel" id="phone" name="phone" placeholder="e.g. (675) 7000 0000" maxLength={40} />

              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" defaultValue="">
                <option value="" disabled>Select a topic...</option>
                {SUBJECTS.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" rows={6} placeholder="Write your message here..." required maxLength={5000} />

              <button type="submit" className="btn btn-primary full-width">Send Message</button>
              <p className="form-note">* Required fields. We aim to respond within 3 business days.</p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
