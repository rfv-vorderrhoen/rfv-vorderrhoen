import { withBase } from "@/lib/paths";

const signupUrl = withBase("/probetraining-anfragen");
const signupFormUrl = "https://forms.gle/125tRq4vGQekTKjr5";

export const siteConfig = {
  name: "RFV Vorderrhön e.V.",
  shortName: "RFV",
  description:
    "Ein Voltigierverein mit strukturiertem Training für Kinder, Jugendliche und Erwachsene in familiärer Atmosphäre.",
  location: "Fuldaer Str. 14, 36093 Künzell, Deutschland",
  email: "rfv-vorderrhoen@web.de",
  phone: "+49 1522 4490665",
  signupUrl,
  signupFormUrl,
  applyUrl: signupUrl,
  trialUrl: signupUrl,
  applyFormUrl: signupFormUrl,
  trialFormUrl: signupFormUrl,
  siteUrl: "https://example.github.io/rfv-vorderrhoen",
};

export const socialLinks = [
  {
    label: "Vereinsaccount",
    platform: "Instagram",
    handle: "@rfv_vorderrhoen",
    href: "https://www.instagram.com/rfv_vorderrhoen",
  },
  {
    label: "Team 1",
    platform: "Instagram",
    handle: "@vorderrhoen_1",
    href: "https://www.instagram.com/vorderrhoen_1",
  },
];

export const mainNav = [
  { href: withBase("/"), label: "Start" },
  { href: withBase("/news"), label: "Aktuelles" },
  { href: withBase("/pferde"), label: "Pferde" },
  { href: withBase("/training"), label: "Training" },
  { href: withBase("/pricing"), label: "Mitgliedschaften" },
  { href: withBase("/about-club"), label: "Über Uns" },
  { href: withBase("/faq"), label: "FAQ" },
];

export const footerNav = [
  ...mainNav,
  { href: signupUrl, label: "Probetraining anfragen" },
  { href: withBase("/legal"), label: "Impressum" },
  { href: withBase("/privacy"), label: "Datenschutz" },
  { href: withBase("/contact"), label: "Kontakt" },
];

export const benefits = [
  {
    title: "Sportliche Basis",
    text: "Balance, Körperspannung, Timing und Selbstvertrauen wachsen Schritt für Schritt auf und neben dem Pferd.",
  },
  {
    title: "Training als Team",
    text: "Voltigiererinnen und Voltigierer lernen in kleinen Gruppen mit klarer Struktur, gemeinsamer Verantwortung und ruhigem Coaching.",
  },
  {
    title: "Pferd zuerst",
    text: "Respekt für das Pferd ist Teil jeder Einheit, von den Stallabläufen bis zur Arbeit auf dem Pferd.",
  },
];

export const trustPoints = [
  "Strukturierte Gruppen für Einsteiger, Fortgeschrittene und ambitionierte Athletinnen und Athleten",
  "Sicherheitsorientiertes Coaching mit klaren Erwartungen für Voltigierer und Familien",
  "Eine ruhige Trainingsumgebung, die Vertrauen vor Tempo setzt",
  "Eine statische Website-Architektur für schnelle Ladezeiten und einfache Pflege",
];

export const trainingHighlights = [
  "Aufwärmen, Mobilität und Kraftvorbereitung",
  "Techniktraining auf dem Holzpferd oder Movie",
  "Voltigieren auf dem Pferd",
  "Pferdepflege und Verantwortung im Team",
];

export const faqItems = [
  {
    question: "Braucht man vor dem Einstieg Reiterfahrung?",
    answer:
      "Nein. Viele neue Voltigiererinnen und Voltigierer starten ohne Reiterfahrung. In den ersten Einheiten geht es vor allem um Sicherheit, Koordination und Grundlagen.",
  },
  {
    question: "Welche Altersgruppen trainieren bei euch?",
    answer:
      "Aktuell trainieren bei uns Kinder, Jugendliche und Erwachsene. Die Einteilung richtet sich nicht nur nach dem Alter, sondern auch nach Fähigkeitsniveau und Trainingsziel.",
  },
  {
    question: "Was soll man zur Probestunde mitbringen?",
    answer:
      "Am besten enganliegende Sportkleidung, idealerweise Schläppchen, zusammengebundene Haare und etwas zu trinken. Alles Weitere teilen wir bei der Terminbestätigung mit.",
  },
  {
    question: "Wie funktioniert die Bezahlung?",
    answer:
      "Auf der Seite zu den Mitgliedschaften erklären wir, wie Vereinsmitgliedschaft und aktive Teilnahme zusammenhängen. Die aktuelle Beitragsordnung und die passende Einordnung besprechen wir anschließend persönlich mit dir.",
  },
];
