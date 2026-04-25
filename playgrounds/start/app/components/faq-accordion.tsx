import { useState } from "react";
import type { faqs } from "../lib/data";

type FaqItem = (typeof faqs)[number];

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="faq-list">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="faq-item">
            <button
              type="button"
              className="faq-trigger"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              {item.question}
              <svg
                className={`faq-chevron${isOpen ? " faq-chevron-open" : ""}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isOpen && <div className="faq-body">{item.answer}</div>}
          </div>
        );
      })}
    </div>
  );
}
