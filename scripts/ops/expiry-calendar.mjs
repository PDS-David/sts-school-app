#!/usr/bin/env node
/**
 * Writes a calendar file (.ics) with the dated schedule for a Render FREE Postgres database.
 *
 *   node scripts/ops/expiry-calendar.mjs 2026-11-12            # day 0 = the date the database was created
 *   node scripts/ops/expiry-calendar.mjs 2026-11-12 out.ics     # optional output path
 *
 * Render free Postgres: expires 30 days after creation, 14-day grace period to upgrade, then deleted (day 44).
 * Import the file into Google Calendar, Outlook or Apple Calendar. Nothing leaves your machine.
 */
import { writeFileSync } from 'node:fs';

const [dateArg, outArg] = process.argv.slice(2);
if (!/^\d{4}-\d{2}-\d{2}$/.test(dateArg ?? '')) {
  console.error('Usage: node scripts/ops/expiry-calendar.mjs YYYY-MM-DD [output.ics]\n  YYYY-MM-DD = the day the Render database was created (day 0).');
  process.exit(2);
}
const day0 = new Date(`${dateArg}T00:00:00Z`);
if (Number.isNaN(day0.getTime()) || day0.toISOString().slice(0, 10) !== dateArg) {
  console.error(`"${dateArg}" is not a real calendar date.`);
  process.exit(2);
}

const addDays = (d, n) => new Date(d.getTime() + n * 86_400_000);
const ymd = (d) => d.toISOString().slice(0, 10).replaceAll('-', '');
const label = (d) => d.toISOString().slice(0, 10);

// alarms: minutes-style durations relative to the start of the all-day event (00:00 local).
const NINE_AM = 'PT9H'; // 09:00 on the day
const NINE_AM_3_DAYS_BEFORE = '-P2DT15H'; // 09:00 three days earlier

const events = [
  { day: 0, title: 'STS DB day 0: create, bootstrap, first dump', note: 'Run the rebuild steps, take the first pg_dump and test a restore. Free database expires on day 30.', alarms: [NINE_AM] },
  { day: 7, title: 'STS DB weekly dump (week 1)', note: 'pg_dump to a file and copy it off Render. Free plan has no backups.', alarms: [NINE_AM] },
  { day: 14, title: 'STS DB weekly dump (week 2)', note: 'pg_dump to a file and copy it off Render.', alarms: [NINE_AM] },
  { day: 21, title: 'STS DB: decide the paid plan', note: 'Choose the paid plan and make sure the payment method works. Upgrade is on day 25.', alarms: [NINE_AM, NINE_AM_3_DAYS_BEFORE] },
  { day: 25, title: 'STS DB: UPGRADE TO PAID TODAY', note: 'Take a fresh dump, upgrade the database in the Render dashboard, check login and that backups are on.', alarms: [NINE_AM, NINE_AM_3_DAYS_BEFORE] },
  { day: 28, title: 'STS DB: verify the upgrade', note: 'Database must show a paid type. If not, upgrade now: day 30 is expiry.', alarms: [NINE_AM] },
  { day: 30, title: 'STS DB: FREE EXPIRY DAY', note: 'The free database expires today and becomes inaccessible unless upgraded. 14-day grace starts.', alarms: [NINE_AM, NINE_AM_3_DAYS_BEFORE] },
  { day: 44, title: 'STS DB: LAST DAY BEFORE DELETION', note: 'After this the database and all its data are deleted. Upgrade or restore from the latest dump.', alarms: [NINE_AM, NINE_AM_3_DAYS_BEFORE] },
];

const esc = (s) => s.replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,').replaceAll('\n', '\\n');
// RFC 5545: lines are limited to 75 octets; continuation lines start with one space.
function fold(line) {
  const out = [];
  let rest = Buffer.from(line, 'utf8');
  let first = true;
  while (rest.length > (first ? 75 : 74)) {
    let cut = first ? 75 : 74;
    while ((rest[cut] & 0xc0) === 0x80) cut--; // never split a UTF-8 character
    out.push((first ? '' : ' ') + rest.subarray(0, cut).toString('utf8'));
    rest = rest.subarray(cut);
    first = false;
  }
  out.push((first ? '' : ' ') + rest.toString('utf8'));
  return out;
}

const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//STS School App//Render free DB schedule//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
for (const e of events) {
  const start = addDays(day0, e.day);
  lines.push('BEGIN:VEVENT', `UID:sts-db-${dateArg}-day${e.day}@sts-school-app`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ymd(start)}`, `DTEND;VALUE=DATE:${ymd(addDays(start, 1))}`,
    `SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc(e.note)}`, 'TRANSP:TRANSPARENT');
  for (const trigger of e.alarms) {
    lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.title)}`, `TRIGGER:${trigger}`, 'END:VALARM');
  }
  lines.push('END:VEVENT');
}
lines.push('END:VCALENDAR');

const out = outArg ?? `sts-db-expiry-${dateArg}.ics`;
writeFileSync(out, lines.flatMap(fold).join('\r\n') + '\r\n', 'utf8');

console.log(`Wrote ${out} (${events.length} events). Day 0 = ${label(day0)}.\n`);
for (const e of events) console.log(`  day ${String(e.day).padStart(2)}  ${label(addDays(day0, e.day))}  ${e.title}`);
