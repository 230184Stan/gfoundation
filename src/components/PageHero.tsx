export default function PageHero({
  title,
  subtitle,
  variant,
}: {
  title: string;
  subtitle: string;
  variant?: 'about-hero' | 'programs-hero';
}) {
  return (
    <section className={`page-hero${variant ? ` ${variant}` : ''}`}>
      <div className="container">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
