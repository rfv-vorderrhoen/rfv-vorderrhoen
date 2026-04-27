import type { PropsWithChildren } from "react";

export default function SectionReveal({ children }: PropsWithChildren) {
  return (
    <div className="section-reveal" data-reveal data-reveal-state="pending">
      {children}
    </div>
  );
}
