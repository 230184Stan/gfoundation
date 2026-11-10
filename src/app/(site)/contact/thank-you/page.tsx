import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Message Received' };

export default function ThankYouPage() {
  return (
    <section className="thankyou-section">
      <div className="thankyou-box">
        <div className="thankyou-icon">✅</div>
        <h1>Message Received!</h1>
        <p>
          Thank you for reaching out to the Gamuna Foundation.
          <br />
          We&apos;ve received your message and will get back to you within <strong>3 business days</strong>.
        </p>
        <p style={{ fontStyle: 'italic', color: 'var(--text-light)' }}>
          “Together, we can create lasting change and inspire a brighter future for our communities.”
        </p>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </section>
  );
}
