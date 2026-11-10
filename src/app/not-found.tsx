import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="thankyou-section">
      <div className="thankyou-box">
        <div className="thankyou-icon">🧭</div>
        <h1>Page not found</h1>
        <p>We couldn&apos;t find the page you were looking for.</p>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </section>
  );
}
