"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is this really free?",
    a: "Yes, completely free. No hidden fees, no premium tier, no account required.",
  },
  {
    q: "Where is my data stored?",
    a: "Everything is stored in your browser's local storage. Nothing is sent to a server. If you clear your browser data, your manual data will be erased — so generate your PDF before clearing.",
  },
  {
    q: "Can I come back and finish later?",
    a: "Absolutely. Your progress auto-saves as you type. Close the tab, come back tomorrow — your data will be right where you left it (as long as you use the same browser and haven't cleared your data).",
  },
  {
    q: "What format is the PDF?",
    a: "The PDF is a clean, professionally formatted document with a cover page, table of contents, and individual section pages. It's print-ready and looks great both on screen and on paper.",
  },
  {
    q: "Do I have to fill in every section?",
    a: "No. Every section is optional. Fill in what applies to your home and skip the rest. Only sections with data will appear in the final PDF.",
  },
  {
    q: "Can I edit the PDF after generating it?",
    a: "The generated PDF is a static document. To make changes, update your data in the builder and generate a new PDF. Since everything auto-saves, you won't lose any work.",
  },
  {
    q: "Does this work on mobile?",
    a: "Yes. The builder is fully responsive and works on phones and tablets. That said, filling in 18 sections is easier on a laptop or desktop.",
  },
  {
    q: "How do I share the manual?",
    a: "Generate the PDF, then share it however you'd like — email it, print it, put it on a USB drive, or leave a printed copy in the kitchen drawer. For rentals, many hosts include the PDF link in their Airbnb or VRBO listing.",
  },
  {
    q: "What's the difference between Seller and Host mode?",
    a: "Seller mode includes sections like warranties, HOA details, and document vault — things a new homeowner needs. Host mode swaps those for check-in/check-out instructions, house rules, and an amenities guide — things a short-term rental guest needs. Shared sections like WiFi, emergency info, and local tips appear in both.",
  },
  {
    q: "Can I use this for my Airbnb or VRBO?",
    a: "Absolutely. Choose \"Short-Term Rental\" when you start and you'll get sections tailored for guests: check-in instructions, house rules, amenities guide, local recommendations, and more.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer group"
            >
              <span className="text-sm font-medium text-text-primary pr-4">
                {faq.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-text-secondary flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-200 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
