import { defineCollection, z } from "astro:content";

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    navLabel: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ctaEyebrow: z.string().optional(),
    ctaTitle: z.string().optional(),
    ctaPrimaryLabel: z.string().optional(),
    ctaPrimaryUrl: z.string().optional(),
    ctaSecondaryLabel: z.string().optional(),
    ctaSecondaryUrl: z.string().optional(),
  }),
});

const news = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isEvent: z.boolean().default(false),
      eventStart: z.coerce.date().optional(),
      eventEnd: z.coerce.date().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      draft: z.boolean().optional(),
      featured: z.boolean().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    })
    .refine(
      ({ eventStart, eventEnd }) =>
        (!eventStart && !eventEnd) || (!!eventStart && !!eventEnd),
      {
        message: "eventStart and eventEnd must be provided together.",
        path: ["eventEnd"],
      },
    )
    .refine(
      ({ eventStart, eventEnd }) =>
        !eventStart || !eventEnd || eventEnd.getTime() > eventStart.getTime(),
      {
        message: "eventEnd must be after eventStart.",
        path: ["eventEnd"],
      },
    ),
});

const pricing = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    groupLabel: z.string().optional(),
    description: z.string(),
    features: z.array(z.string()),
    highlighted: z.boolean().optional(),
    order: z.number().optional(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().optional(),
  }),
});

const horses = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    ageLabel: z.string(),
    role: z.string(),
    race: z.string(),
    clubSince: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().optional(),
    order: z.number().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { pages, news, pricing, horses };
