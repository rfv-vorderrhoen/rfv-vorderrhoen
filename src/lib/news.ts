import type { CollectionEntry } from "astro:content";

type NewsEntry = CollectionEntry<"news">;

export const toUtcDayTimestamp = (date: Date) =>
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

export const getEventSortDate = (entry: NewsEntry) =>
    entry.data.eventStart ?? entry.data.date;

export const getEventVisibilityDate = (entry: NewsEntry) =>
    entry.data.eventEnd ?? getEventSortDate(entry);

export const compareNewsEntriesByDateDesc = (
    a: NewsEntry,
    b: NewsEntry,
) => b.data.date.getTime() - a.data.date.getTime();

export const compareEventEntriesByDateAsc = (
    a: NewsEntry,
    b: NewsEntry,
) =>
    getEventSortDate(a).getTime() - getEventSortDate(b).getTime() ||
    a.data.date.getTime() - b.data.date.getTime() ||
    a.slug.localeCompare(b.slug);

export const isUpcomingEventEntry = (
    entry: NewsEntry,
    currentDate = new Date(),
) =>
    entry.data.isEvent &&
    toUtcDayTimestamp(getEventVisibilityDate(entry)) >=
        toUtcDayTimestamp(currentDate);

export const getUpcomingEventEntries = (
    entries: NewsEntry[],
    currentDate = new Date(),
) =>
    entries
        .filter((entry) => isUpcomingEventEntry(entry, currentDate))
        .sort(compareEventEntriesByDateAsc);

export const getHomepageNewsEntries = (
    entries: NewsEntry[],
    limit: number,
    currentDate = new Date(),
) => {
    const upcomingEvents = getUpcomingEventEntries(entries, currentDate);
    const upcomingEventSlugs = new Set(upcomingEvents.map((entry) => entry.slug));
    const remainingEntries = [...entries]
        .filter((entry) => !upcomingEventSlugs.has(entry.slug))
        .sort(compareNewsEntriesByDateDesc);

    return [...upcomingEvents, ...remainingEntries].slice(0, limit);
};
