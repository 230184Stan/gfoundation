const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const LONG_MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

/** Split a YYYY-MM-DD string without any timezone conversion. */
export function parseDate(iso: string): { year: string; month: number; day: string } {
  const [y, m, d] = iso.split('-');
  return { year: y, month: Number(m) - 1, day: d };
}

export function eventDateParts(iso: string) {
  const { year, month, day } = parseDate(iso);
  return { year, month: MONTHS[month] ?? '', day };
}

export function longDate(iso: string): string {
  const { year, month, day } = parseDate(iso);
  return `${LONG_MONTHS[month] ?? ''} ${Number(day)}, ${year}`;
}

/** Today's date (YYYY-MM-DD) in Papua New Guinea. */
export function todayInPNG(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Port_Moresby' });
}

export function telHref(phone: string): string {
  return `tel:+${phone.replace(/\D/g, '')}`;
}

export function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
