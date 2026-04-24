import type { CollectionEntry } from "astro:content";
import { withBase } from "@/lib/paths";
import { siteConfig } from "@/lib/site";

function padCalendarUnit(value: number) {
  return String(value).padStart(2, "0");
}

function formatCalendarDate(date: Date) {
  return `${date.getUTCFullYear()}${padCalendarUnit(date.getUTCMonth() + 1)}${padCalendarUnit(date.getUTCDate())}`;
}

function formatCalendarTimestamp(date: Date) {
  return `${date.getUTCFullYear()}${padCalendarUnit(date.getUTCMonth() + 1)}${padCalendarUnit(date.getUTCDate())}T${padCalendarUnit(date.getUTCHours())}${padCalendarUnit(date.getUTCMinutes())}${padCalendarUnit(date.getUTCSeconds())}Z`;
}

function formatCalendarIsoDate(date: Date) {
  return `${date.getUTCFullYear()}-${padCalendarUnit(date.getUTCMonth() + 1)}-${padCalendarUnit(date.getUTCDate())}`;
}

function getNextDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1),
  );
}

function getEventRange(entry: CollectionEntry<"news">) {
  if (entry.data.eventStart && entry.data.eventEnd) {
    return {
      type: "timed" as const,
      start: entry.data.eventStart,
      end: entry.data.eventEnd,
    };
  }

  return {
    type: "all-day" as const,
    start: entry.data.date,
    end: getNextDay(entry.data.date),
  };
}

function getEventArticleUrl(slug: string, site?: URL | string) {
  return new URL(
    withBase(`/news/${slug}`),
    site ?? siteConfig.siteUrl,
  ).toString();
}

function getEventDescription(
  entry: CollectionEntry<"news">,
  site?: URL | string,
) {
  return [entry.data.description, getEventArticleUrl(entry.slug, site)]
    .filter(Boolean)
    .join("\n\n");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldIcsLine(line: string) {
  if (line.length <= 74) {
    return line;
  }

  const chunks = [];

  for (let index = 0; index < line.length; index += 74) {
    const segment = line.slice(index, index + 74);
    chunks.push(index === 0 ? segment : ` ${segment}`);
  }

  return chunks.join("\r\n");
}

export function getCalendarLinks(
  entry: CollectionEntry<"news">,
  site?: URL | string,
) {
  const range = getEventRange(entry);
  const details = getEventDescription(entry, site);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: entry.data.title,
    dates:
      range.type === "timed"
        ? `${formatCalendarTimestamp(range.start)}/${formatCalendarTimestamp(range.end)}`
        : `${formatCalendarDate(range.start)}/${formatCalendarDate(range.end)}`,
    details,
  });
  const outlookParams = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: entry.data.title,
    body: details,
    allday: range.type === "all-day" ? "true" : "false",
    startdt:
      range.type === "timed"
        ? range.start.toISOString()
        : formatCalendarIsoDate(range.start),
    enddt:
      range.type === "timed"
        ? range.end.toISOString()
        : formatCalendarIsoDate(range.end),
  });

  return {
    google: `https://calendar.google.com/calendar/render?${params.toString()}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams.toString()}`,
    apple: withBase(`/news/${entry.slug}.ics`),
  };
}

export function buildCalendarFile(
  entry: CollectionEntry<"news">,
  site?: URL | string,
) {
  const articleUrl = getEventArticleUrl(entry.slug, site);
  const description = getEventDescription(entry, site);
  const range = getEventRange(entry);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RFV Vorderrhön e.V.//Events//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${entry.slug}@rfv-vorderrhoen.de`,
    `DTSTAMP:${formatCalendarTimestamp(new Date())}`,
    ...(range.type === "timed"
      ? [
          `DTSTART:${formatCalendarTimestamp(range.start)}`,
          `DTEND:${formatCalendarTimestamp(range.end)}`,
        ]
      : [
          `DTSTART;VALUE=DATE:${formatCalendarDate(range.start)}`,
          `DTEND;VALUE=DATE:${formatCalendarDate(range.end)}`,
        ]),
    `SUMMARY:${escapeIcsText(entry.data.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `URL:${escapeIcsText(articleUrl)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}
