import { motion, useReducedMotion } from "framer-motion";

type MembershipItem = {
  id: string;
  data: {
    name: string;
    description: string;
    features: string[];
    highlighted?: boolean;
  };
};

type Props = {
  items: MembershipItem[];
};

export default function MembershipCards({ items }: Props) {
  const reduceMotion = useReducedMotion();
  const gridClassName =
    items.length === 1
      ? "md:grid-cols-1"
      : items.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={`grid gap-5 ${gridClassName}`}>
      {items.map((item, index) => (
        <motion.article
          key={item.id}
          initial={false}
          whileHover={reduceMotion ? undefined : { y: -6 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.2, delay: index * 0.04 }
          }
          className={`panel flex h-full flex-col p-6 md:p-8 ${
            item.data.highlighted
              ? "border-[rgba(47,71,50,0.34)] bg-[rgba(255,251,244,0.95)] shadow-[var(--shadow-strong)]"
              : ""
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold leading-tight md:text-3xl">
                {item.data.name}
              </h3>
            </div>
            {item.data.highlighted && (
              <span className="rounded-full bg-[var(--color-forest)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-cream-strong)]">
                Empfohlen
              </span>
            )}
          </div>

          <p className="mt-5 text-[var(--color-soft-ink)]">
            {item.data.description}
          </p>

          <div className="mt-6 rounded-[1.4rem] border border-[var(--color-line)] bg-white/55 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-moss)]">
              Kurzinfo
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-soft-ink)]">
              {item.data.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--color-moss)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
