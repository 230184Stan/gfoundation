import Link from 'next/link';
import { getSettings } from '@/lib/data';
import { telHref } from '@/lib/format';

export default async function Footer() {
  const { general } = await getSettings();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/assets/logo.png" alt="Logo" className="footer-logo" />
          <p>
            {general.org_name}
            <br />
            {general.location}
          </p>
        </div>
        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/programs">Programs</Link>
          <Link href="/news">News</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="footer-contact">
          <p>
            📧 <a href={`mailto:${general.email}`}>{general.email}</a>
          </p>
          {general.facebook_url && (
            <p>
              📘{' '}
              <a href={general.facebook_url} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </p>
          )}
          <p>
            📞 <a href={telHref(general.phone)}>{general.phone}</a>
          </p>
        </div>
      </div>
      <p className="footer-copy">
        &copy; {new Date().getFullYear()} {general.org_name}. All rights reserved.
      </p>
    </footer>
  );
}
